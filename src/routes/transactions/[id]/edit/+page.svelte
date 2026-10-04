<script lang="ts">
  import Grid from '@/components/Grid.svelte'
  import TransactionForm from '@/components/TransactionForm.svelte'
  import type { ActionData, PageData } from './$types'

  let { data, form }: { data: PageData; form: ActionData } = $props()
</script>

<Grid direction="column" gap="xl">
  <Grid direction="column" gap="xs">
    <a href="/transactions/{data.transaction.id}">
      <Grid align="center" gap="xs">
        <wa-icon name="arrow-left"></wa-icon>
        <span>Back to Transaction</span>
      </Grid>
    </a>
    <h1>Edit Transaction</h1>
    <p>Update transaction details, amount, asset, or notes.</p>
  </Grid>

  <wa-card>
    <TransactionForm
      transaction={data.transaction}
      accounts={data.accounts}
      message={form?.message}
    />
  </wa-card>
</Grid>
