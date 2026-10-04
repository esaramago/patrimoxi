<script lang="ts">
  import Grid from '@/components/Grid.svelte'
  import type { Transaction } from '@/types/transaction'
  import type { ActionData, PageData } from './$types'
  import {
    formatDate,
    formatDateTime,
    formatAmount,
    getTransactionTypeBadgeVariant,
    formatTransactionTypeName
  } from '@/lib/formatters'

  let { data, form }: { data: PageData; form: ActionData } = $props()

  let transaction = $derived<Transaction>(data.transaction)
</script>

<Grid direction="column" gap="xl">
  <Grid direction="column" gap="xs">
    <a href="/transactions">
      <Grid align="center" gap="xs">
        <wa-icon name="arrow-left"></wa-icon>
        <span>Back to Transactions</span>
      </Grid>
    </a>

    <Grid align="center" justify="space-between" wrap={true}>
      <Grid align="center" gap="s" wrap={true}>
        <h1>
          {formatTransactionTypeName(transaction.type)}
          {#if transaction.asset}
            — {transaction.asset}
          {/if}
        </h1>
        <wa-badge variant={getTransactionTypeBadgeVariant(transaction.type)}>
          {formatTransactionTypeName(transaction.type)}
        </wa-badge>
      </Grid>

      <Grid align="center" gap="s" wrap={true}>
        <wa-button href="/transactions/{transaction.id}/edit" variant="brand">
          <wa-icon slot="start" name="pen-to-square"></wa-icon>
          Edit Transaction
        </wa-button>

        <form
          method="POST"
          action="?/delete"
          onsubmit={(e) => {
            if (!confirm('Are you sure you want to delete this transaction?')) {
              e.preventDefault()
            }
          }}
        >
          <wa-button type="submit" variant="danger">
            <wa-icon slot="start" name="trash"></wa-icon>
            Delete
          </wa-button>
        </form>
      </Grid>
    </Grid>
  </Grid>

  {#if form?.message}
    <wa-callout variant="danger">
      <wa-icon slot="icon" name="circle-exclamation"></wa-icon>
      {form.message}
    </wa-callout>
  {/if}

  <Grid direction="column" gap="l">
    <wa-card>
      <Grid direction="column" gap="l">
        <h3>Transaction Details</h3>

        <Grid wrap={true} break="small">
          <Grid direction="column" gap="xs">
            <strong>Account</strong>
            {#if transaction.expand?.account}
              <a href="/accounts/{transaction.expand.account.id}">
                {transaction.expand.account.name}
              </a>
            {:else}
              <span>—</span>
            {/if}
          </Grid>

          <Grid direction="column" gap="xs">
            <strong>Date</strong>
            <span>{formatDate(transaction.date)}</span>
          </Grid>

          <Grid direction="column" gap="xs">
            <strong>Amount</strong>
            <span>{formatAmount(transaction.amount, transaction.currency || transaction.expand?.account?.currency || 'EUR')}</span>
          </Grid>

          <Grid direction="column" gap="xs">
            <strong>Currency</strong>
            <span>{transaction.currency || transaction.expand?.account?.currency || 'EUR'}</span>
          </Grid>

          {#if transaction.asset}
            <Grid direction="column" gap="xs">
              <strong>Asset / Ticker</strong>
              <span>{transaction.asset}</span>
            </Grid>
          {/if}

          {#if transaction.quantity != null}
            <Grid direction="column" gap="xs">
              <strong>Quantity</strong>
              <span>{transaction.quantity}</span>
            </Grid>
          {/if}

          {#if transaction.unit_price != null}
            <Grid direction="column" gap="xs">
              <strong>Unit Price</strong>
              <span>{formatAmount(transaction.unit_price, transaction.currency || transaction.expand?.account?.currency || 'EUR')}</span>
            </Grid>
          {/if}

          {#if transaction.fee != null}
            <Grid direction="column" gap="xs">
              <strong>Fee</strong>
              <span>{formatAmount(transaction.fee, transaction.currency || transaction.expand?.account?.currency || 'EUR')}</span>
            </Grid>
          {/if}

          {#if transaction.tax != null}
            <Grid direction="column" gap="xs">
              <strong>Tax</strong>
              <span>{formatAmount(transaction.tax, transaction.currency || transaction.expand?.account?.currency || 'EUR')}</span>
            </Grid>
          {/if}

          {#if transaction.exchange_rate != null}
            <Grid direction="column" gap="xs">
              <strong>Exchange Rate</strong>
              <span>{transaction.exchange_rate}</span>
            </Grid>
          {/if}

          <Grid direction="column" gap="xs">
            <strong>Created</strong>
            <span>{formatDateTime(transaction.created)}</span>
          </Grid>

          <Grid direction="column" gap="xs">
            <strong>Last Updated</strong>
            <span>{formatDateTime(transaction.updated)}</span>
          </Grid>
        </Grid>
      </Grid>
    </wa-card>

    {#if transaction.notes}
      <wa-card>
        <Grid direction="column" gap="s">
          <h3>Notes</h3>
          <p>{transaction.notes}</p>
        </Grid>
      </wa-card>
    {/if}
  </Grid>
</Grid>
