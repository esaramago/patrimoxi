<script lang="ts">
  import Grid from '@/components/Grid.svelte'
  import AccountForm from '@/components/AccountForm.svelte'
  import type { ActionData } from './$types'

  let { form }: { form: ActionData } = $props()
</script>

<Grid direction="column" gap="xl">
  <Grid direction="column" gap="xs">
    <a href="/accounts">
      <Grid align="center" gap="xs">
        <wa-icon name="arrow-left"></wa-icon>
        <span>Back to Accounts</span>
      </Grid>
    </a>
    <h1>Create New Account</h1>
    <p>Register a bank account, broker, cash wallet, or crypto holding account.</p>
  </Grid>

  <wa-card>
    <AccountForm message={form?.message} />
  </wa-card>
</Grid>
