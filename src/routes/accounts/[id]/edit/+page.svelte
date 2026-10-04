<script lang="ts">
  import Grid from '@/components/Grid.svelte'
  import AccountForm from '@/components/AccountForm.svelte'
  import type { ActionData, PageData } from './$types'

  let { data, form }: { data: PageData; form: ActionData } = $props()
</script>

<Grid direction="column" gap="xl">
  <Grid direction="column" gap="xs">
    <a href="/accounts/{data.account.id}">
      <Grid align="center" gap="xs">
        <wa-icon name="arrow-left"></wa-icon>
        <span>Back to Account</span>
      </Grid>
    </a>
    <h1>Edit Account</h1>
    <p>Update information for {data.account.name}.</p>
  </Grid>

  <wa-card>
    <AccountForm account={data.account} message={form?.message} />
  </wa-card>
</Grid>
