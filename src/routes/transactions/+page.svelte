<script lang="ts">
  import Grid from '@/components/Grid.svelte'
  import TransactionTable from '@/components/TransactionTable.svelte'
  import type { Transaction } from '@/types/transaction'
  import type { Account } from '@/types/account'
  import type { ActionData, PageData } from './$types'

  let { data, form }: { data: PageData; form: ActionData } = $props()

  let transactions = $derived<Transaction[]>(data.transactions ?? [])
  let accounts = $derived<Account[]>(data.accounts ?? [])

  let selectedAccountId = $state<string>('')
  let selectedType = $state<string>('')

  let filteredTransactions = $derived(
    transactions.filter((tx) => {
      if (selectedAccountId && tx.account !== selectedAccountId) return false
      if (selectedType && tx.type !== selectedType) return false
      return true
    })
  )
</script>

<Grid direction="column" gap="xl">
  <Grid direction="column" gap="s">
    <Grid align="center" justify="space-between" wrap={true}>
      <Grid direction="column" gap="xs">
        <h1>Transactions</h1>
        <p>Record and track all your financial movements and investment operations.</p>
      </Grid>

      <wa-button variant="brand" href="/transactions/new">
        <wa-icon slot="start" name="plus"></wa-icon>
        New Transaction
      </wa-button>
    </Grid>

    <Grid align="center" gap="s" wrap={true}>
      <wa-badge variant="brand">{transactions.length} Total</wa-badge>
      {#if selectedAccountId || selectedType}
        <wa-badge variant="neutral">{filteredTransactions.length} Filtered</wa-badge>
      {/if}
    </Grid>
  </Grid>

  {#if form?.message}
    <wa-callout variant="danger">
      <wa-icon slot="icon" name="circle-exclamation"></wa-icon>
      {form.message}
    </wa-callout>
  {/if}

  {#if data.error}
    <wa-callout variant="danger">
      <wa-icon slot="icon" name="circle-exclamation"></wa-icon>
      {data.error}
    </wa-callout>
  {/if}

  {#if transactions.length > 0}
    <Grid wrap={true} break="small">
      <wa-select
        label="Filter by Account"
        value={selectedAccountId}
        onchange={(e: Event) => {
          const target = e.target as HTMLSelectElement
          selectedAccountId = target.value
        }}
      >
        <wa-option value="">All Accounts</wa-option>
        {#each accounts as acc (acc.id)}
          <wa-option value={acc.id}>{acc.name}</wa-option>
        {/each}
      </wa-select>

      <wa-select
        label="Filter by Type"
        value={selectedType}
        onchange={(e: Event) => {
          const target = e.target as HTMLSelectElement
          selectedType = target.value
        }}
      >
        <wa-option value="">All Types</wa-option>
        <wa-option value="buy">Buy</wa-option>
        <wa-option value="sell">Sell</wa-option>
        <wa-option value="deposit">Deposit</wa-option>
        <wa-option value="withdrawal">Withdrawal</wa-option>
        <wa-option value="dividend">Dividend</wa-option>
        <wa-option value="interest">Interest</wa-option>
        <wa-option value="fee">Fee</wa-option>
        <wa-option value="transfer">Transfer</wa-option>
      </wa-select>
    </Grid>
  {/if}

  <TransactionTable transactions={filteredTransactions} />
</Grid>
