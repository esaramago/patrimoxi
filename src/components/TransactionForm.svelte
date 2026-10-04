<script lang="ts">
  import Grid from '@/components/Grid.svelte'
  import type { Account } from '@/types/account'
  import type { Transaction, TransactionType } from '@/types/transaction'
  import { formatDateForInput } from '@/lib/formatters'

  interface Props {
    transaction?: Transaction | null
    accounts: Account[]
    selectedAccountId?: string
    action?: string
    message?: string
  }

  let {
    transaction = null,
    accounts = [],
    selectedAccountId = '',
    action = '',
    message = ''
  }: Props = $props()

  // svelte-ignore state_referenced_locally
  let initialAccount = transaction?.account || selectedAccountId || (accounts[0]?.id ?? '')
  // svelte-ignore state_referenced_locally
  let currentAccount = $state<string>(initialAccount)
  // svelte-ignore state_referenced_locally
  let currentType = $state<TransactionType>(transaction?.type ?? 'buy')

  let selectedAccountObj = $derived(accounts.find((a) => a.id === currentAccount))
  // svelte-ignore state_referenced_locally
  let defaultCurrency = transaction?.currency || selectedAccountObj?.currency || 'EUR'

  // svelte-ignore state_referenced_locally
  let currentQuantity = $state<string>(transaction?.quantity != null ? String(transaction.quantity) : '')
  // svelte-ignore state_referenced_locally
  let currentUnitPrice = $state<string>(transaction?.unit_price != null ? String(transaction.unit_price) : '')
  // svelte-ignore state_referenced_locally
  let currentFee = $state<string>(transaction?.fee != null ? String(transaction.fee) : '')
  // svelte-ignore state_referenced_locally
  let currentTax = $state<string>(transaction?.tax != null ? String(transaction.tax) : '')
  // svelte-ignore state_referenced_locally
  let currentExchangeRate = $state<string>(transaction?.exchange_rate != null ? String(transaction.exchange_rate) : '')
  // svelte-ignore state_referenced_locally
  let currentAmount = $state<string>(transaction?.amount != null ? String(transaction.amount) : '')

  function deduceAmount(
    type: TransactionType,
    qtyStr: string,
    priceStr: string,
    feeStr: string,
    taxStr: string,
    rateStr: string
  ): string {
    const qty = parseFloat(qtyStr)
    const price = parseFloat(priceStr)
    if (isNaN(qty) || isNaN(price)) {
      return ''
    }

    const rate = parseFloat(rateStr)
    const effectiveRate = !isNaN(rate) && rate > 0 ? rate : 1

    const fee = parseFloat(feeStr)
    const effectiveFee = !isNaN(fee) && fee > 0 ? fee : 0

    const tax = parseFloat(taxStr)
    const effectiveTax = !isNaN(tax) && tax > 0 ? tax : 0

    const base = qty * price * effectiveRate

    let total: number
    if (type === 'buy') {
      total = base + effectiveFee + effectiveTax
    } else if (type === 'sell' || type === 'dividend' || type === 'interest') {
      total = base - effectiveFee - effectiveTax
    } else {
      total = base + effectiveFee + effectiveTax
    }

    const rounded = Math.round((total + Number.EPSILON) * 10000) / 10000
    if (rounded < 0) return '0.00'
    const hasMoreDecimals = (rounded * 100) % 1 !== 0
    return hasMoreDecimals ? String(rounded) : rounded.toFixed(2)
  }

  function updateDeducedAmount() {
    const calculated = deduceAmount(
      currentType,
      currentQuantity,
      currentUnitPrice,
      currentFee,
      currentTax,
      currentExchangeRate
    )
    if (calculated !== '') {
      currentAmount = calculated
    }
  }
</script>

<form method="POST" {action}>
  <Grid direction="column" gap="l">
    {#if message}
      <wa-callout variant="danger">
        <wa-icon slot="icon" name="circle-exclamation"></wa-icon>
        {message}
      </wa-callout>
    {/if}

    <Grid wrap={true} break="small">
      <wa-select
        name="account"
        label="Account"
        value={currentAccount}
        onchange={(e: Event) => {
          const target = e.target as HTMLSelectElement
          currentAccount = target.value
        }}
        required
      >
        {#each accounts as acc (acc.id)}
          <wa-option value={acc.id}>{acc.name} ({acc.currency})</wa-option>
        {/each}
      </wa-select>
      <input type="hidden" name="account_value" value={currentAccount} />

      <wa-select
        name="type"
        label="Transaction Type"
        value={currentType}
        onchange={(e: Event) => {
          const target = e.target as HTMLSelectElement
          currentType = target.value as TransactionType
          updateDeducedAmount()
        }}
        required
      >
        <wa-option value="buy">Buy</wa-option>
        <wa-option value="sell">Sell</wa-option>
        <wa-option value="deposit">Deposit</wa-option>
        <wa-option value="withdrawal">Withdrawal</wa-option>
        <wa-option value="dividend">Dividend</wa-option>
        <wa-option value="interest">Interest</wa-option>
        <wa-option value="fee">Fee</wa-option>
        <wa-option value="transfer">Transfer</wa-option>
      </wa-select>
      <input type="hidden" name="type_value" value={currentType} />
    </Grid>

    <Grid wrap={true} break="small">
      <wa-input
        type="date"
        name="date"
        label="Date"
        value={formatDateForInput(transaction?.date)}
        required
      ></wa-input>

      <wa-input
        type="number"
        name="amount"
        label="Amount"
        placeholder="0.00"
        step="any"
        min="0"
        value={currentAmount}
        oninput={(e: Event) => {
          currentAmount = (e.target as HTMLInputElement).value
        }}
        required
      ></wa-input>
      <input type="hidden" name="amount_value" value={currentAmount} />

      <wa-input
        name="currency"
        label="Currency (ISO 4217)"
        placeholder="EUR"
        maxlength="3"
        value={transaction?.currency || defaultCurrency}
        required
      ></wa-input>
    </Grid>

    <Grid wrap={true} break="small">
      <wa-input
        name="asset"
        label="Asset / Ticker (Optional)"
        placeholder="e.g. VWCE, AAPL, BTC"
        value={transaction?.asset ?? ''}
      ></wa-input>

      <wa-input
        type="number"
        name="quantity"
        label="Quantity (Optional)"
        placeholder="e.g. 10.5"
        step="any"
        value={currentQuantity}
        oninput={(e: Event) => {
          currentQuantity = (e.target as HTMLInputElement).value
          updateDeducedAmount()
        }}
      ></wa-input>
      <input type="hidden" name="quantity_value" value={currentQuantity} />

      <wa-input
        type="number"
        name="unit_price"
        label="Unit Price (Optional)"
        placeholder="e.g. 115.50"
        step="any"
        value={currentUnitPrice}
        oninput={(e: Event) => {
          currentUnitPrice = (e.target as HTMLInputElement).value
          updateDeducedAmount()
        }}
      ></wa-input>
      <input type="hidden" name="unit_price_value" value={currentUnitPrice} />
    </Grid>

    <Grid wrap={true} break="small">
      <wa-input
        type="number"
        name="fee"
        label="Fee (Optional)"
        placeholder="e.g. 1.00"
        step="any"
        value={currentFee}
        oninput={(e: Event) => {
          currentFee = (e.target as HTMLInputElement).value
          updateDeducedAmount()
        }}
      ></wa-input>
      <input type="hidden" name="fee_value" value={currentFee} />

      <wa-input
        type="number"
        name="tax"
        label="Tax (Optional)"
        placeholder="e.g. 0.00"
        step="any"
        value={currentTax}
        oninput={(e: Event) => {
          currentTax = (e.target as HTMLInputElement).value
          updateDeducedAmount()
        }}
      ></wa-input>
      <input type="hidden" name="tax_value" value={currentTax} />

      <wa-input
        type="number"
        name="exchange_rate"
        label="Exchange Rate (Optional)"
        placeholder="e.g. 1.00"
        step="any"
        value={currentExchangeRate}
        oninput={(e: Event) => {
          currentExchangeRate = (e.target as HTMLInputElement).value
          updateDeducedAmount()
        }}
      ></wa-input>
      <input type="hidden" name="exchange_rate_value" value={currentExchangeRate} />
    </Grid>

    <wa-textarea
      name="notes"
      label="Notes (Optional)"
      placeholder="Broker reference, dividend period, transfer details..."
      value={transaction?.notes ?? ''}
    ></wa-textarea>

    <Grid wrap={true}>
      <wa-button type="submit" variant="brand">
        <wa-icon slot="start" name="check"></wa-icon>
        {transaction ? 'Save Changes' : 'Create Transaction'}
      </wa-button>
      <wa-button variant="neutral" href={transaction ? `/transactions/${transaction.id}` : '/transactions'}>
        Cancel
      </wa-button>
    </Grid>
  </Grid>
</form>
