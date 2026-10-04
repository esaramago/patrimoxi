<script lang="ts">
  import Grid from '@/components/Grid.svelte'
  import type { Account } from '@/types/account'

  interface Props {
    account?: Account | null
    action?: string
    message?: string
  }

  let { account = null, action = '', message = '' }: Props = $props()

  // svelte-ignore state_referenced_locally
  let isActive = $state<boolean>(account ? account.active : true)
</script>

<form method="POST" {action}>
  <Grid direction="column" gap="l">
    {#if message}
      <wa-callout variant="danger">
        <wa-icon slot="icon" name="circle-exclamation"></wa-icon>
        {message}
      </wa-callout>
    {/if}

    <wa-input
      name="name"
      label="Account Name"
      placeholder="e.g. ActivoBank, Interactive Brokers, Ledger"
      value={account?.name ?? ''}
      required
    ></wa-input>

    <wa-input
      name="currency"
      label="Currency (ISO 4217)"
      placeholder="EUR"
      value={account?.currency ?? 'EUR'}
      maxlength="3"
      required
    ></wa-input>

    <wa-switch
      name="active"
      checked={isActive}
      onchange={(e: Event) => {
        const target = e.target as HTMLInputElement
        isActive = target.checked
      }}
    >
      Active Account
    </wa-switch>
    <input type="hidden" name="active_value" value={isActive ? 'true' : 'false'} />

    <wa-textarea
      name="notes"
      label="Notes (Optional)"
      placeholder="Account notes, IBAN, account number reference or details..."
      value={account?.notes ?? ''}
    ></wa-textarea>

    <Grid wrap={true}>
      <wa-button type="submit" variant="brand">
        <wa-icon slot="start" name="check"></wa-icon>
        {account ? 'Save Changes' : 'Create Account'}
      </wa-button>
      <wa-button variant="neutral" href={account ? `/accounts/${account.id}` : '/accounts'}>
        Cancel
      </wa-button>
    </Grid>
  </Grid>
</form>
