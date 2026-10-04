<script lang="ts">
  import Grid from '@/components/Grid.svelte'
  import TransactionForm from '@/components/TransactionForm.svelte'
  import type { ActionData, PageData } from './$types'

  let { data, form }: { data: PageData; form: ActionData } = $props()
</script>

<Grid direction="column" gap="xl">
  <Grid direction="column" gap="xs">
    <a href="/transactions">
      <Grid align="center" gap="xs">
        <wa-icon name="arrow-left"></wa-icon>
        <span>Back to Transactions</span>
      </Grid>
    </a>
    <h1>Create New Transaction</h1>
    <p>Record a purchase, sale, deposit, withdrawal, dividend, or fee.</p>
  </Grid>

  {#if data.accounts.length === 0}
    <wa-card>
      <Grid direction="column" align="center">
        <wa-icon name="wallet" variant="solid"></wa-icon>
        <h3>No accounts available</h3>
        <p>You need to create an account before registering any transactions.</p>
        <wa-button variant="brand" href="/accounts/new">
          <wa-icon slot="start" name="plus"></wa-icon>
          Create First Account
        </wa-button>
      </Grid>
    </wa-card>
  {:else}
    <wa-card>
      <TransactionForm
        accounts={data.accounts}
        selectedAccountId={data.selectedAccountId}
        message={form?.message}
      />
    </wa-card>
  {/if}
</Grid>
