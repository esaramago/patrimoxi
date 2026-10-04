<script lang="ts">
  import Grid from '@/components/Grid.svelte'
  import type { Transaction } from '@/types/transaction'
  import {
    formatDate,
    formatAmount,
    getTransactionTypeBadgeVariant,
    formatTransactionTypeName
  } from '@/lib/formatters'

  interface Props {
    transactions: Transaction[]
    showAccount?: boolean
    newHref?: string
    deleteAction?: string
  }

  let {
    transactions = [],
    showAccount = true,
    newHref = '/transactions/new',
    deleteAction = '/transactions?/delete'
  }: Props = $props()
</script>

{#if transactions.length === 0}
  <wa-card>
    <Grid direction="column" align="center">
      <wa-icon name="receipt" variant="solid"></wa-icon>
      <h3>No transactions found</h3>
      <p>Start recording your operations to keep track of your portfolio movements.</p>
      <wa-button variant="brand" href={newHref}>
        <wa-icon slot="start" name="plus"></wa-icon>
        New Transaction
      </wa-button>
    </Grid>
  </wa-card>
{:else}
  <table class="c-table">
    <thead>
      <tr>
        <th>Date</th>
        {#if showAccount}
          <th>Account</th>
        {/if}
        <th>Type</th>
        <th>Asset / Details</th>
        <th>Amount</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each transactions as transaction (transaction.id)}
        <tr>
          <td>
            {formatDate(transaction.date)}
          </td>
          {#if showAccount}
            <td>
              {#if transaction.expand?.account}
                <a href="/accounts/{transaction.expand.account.id}">
                  <strong>{transaction.expand.account.name}</strong>
                </a>
              {:else}
                <span>—</span>
              {/if}
            </td>
          {/if}
          <td>
            <wa-badge variant={getTransactionTypeBadgeVariant(transaction.type)}>
              {formatTransactionTypeName(transaction.type)}
            </wa-badge>
          </td>
          <td>
            {#if transaction.type === 'deposit' || transaction.type === 'withdrawal'}
              <span>—</span>
            {:else if transaction.asset}
              <strong>{transaction.asset}</strong>
              {#if transaction.quantity}
                <span>({transaction.quantity} @ {transaction.unit_price ?? '—'})</span>
              {/if}
            {:else if transaction.notes}
              <span>{transaction.notes}</span>
            {:else}
              <span>—</span>
            {/if}
          </td>
          <td>
            <strong>{formatAmount(transaction.amount, transaction.currency || transaction.expand?.account?.currency || 'EUR')}</strong>
          </td>
          <td>
            <Grid align="center" gap="xs">
              <wa-button href="/transactions/{transaction.id}" size="small" variant="neutral">
                <wa-icon slot="start" name="eye"></wa-icon>
                View
              </wa-button>
              <wa-button href="/transactions/{transaction.id}/edit" size="small" variant="neutral">
                <wa-icon slot="start" name="pen-to-square"></wa-icon>
                Edit
              </wa-button>
              <form
                method="POST"
                action={deleteAction}
                onsubmit={(e) => {
                  if (!confirm('Are you sure you want to delete this transaction?')) {
                    e.preventDefault()
                  }
                }}
              >
                <input type="hidden" name="id" value={transaction.id} />
                <wa-button type="submit" size="small" variant="text">
                  <wa-icon slot="start" name="trash"></wa-icon>
                  Delete
                </wa-button>
              </form>
            </Grid>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
