<script lang="ts">
  import Grid from '@/components/Grid.svelte'
  import type { Account } from '@/types/account'
  import type { ActionData, PageData } from './$types'

  let { data, form }: { data: PageData; form: ActionData } = $props()

  let account = $derived<Account>(data.account)

  function formatDate(isoString: string): string {
    if (!isoString) return '—'
    try {
      return new Date(isoString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return isoString
    }
  }
</script>

<Grid direction="column" gap="xl">
  <Grid direction="column" gap="xs">
    <a href="/accounts">
      <Grid align="center" gap="xs">
        <wa-icon name="arrow-left"></wa-icon>
        <span>Back to Accounts</span>
      </Grid>
    </a>

    <Grid align="center" justify="space-between" wrap={true}>
      <Grid direction="column" gap="xs">
        <Grid align="center" gap="s" wrap={true}>
          <h1>{account.name}</h1>
          <wa-badge variant="neutral">{account.currency}</wa-badge>
          {#if account.active}
            <wa-badge variant="success">Active</wa-badge>
          {:else}
            <wa-badge variant="neutral">Inactive</wa-badge>
          {/if}
        </Grid>
      </Grid>

      <Grid align="center" gap="s" wrap={true}>
        <wa-button href="/accounts/{account.id}/edit" variant="brand">
          <wa-icon slot="start" name="pen-to-square"></wa-icon>
          Edit Account
        </wa-button>

        <form method="POST" action="?/toggleActive">
          <wa-button type="submit" variant="neutral">
            {#if account.active}
              <wa-icon slot="start" name="pause"></wa-icon>
              Deactivate
            {:else}
              <wa-icon slot="start" name="play"></wa-icon>
              Activate
            {/if}
          </wa-button>
        </form>

        <form
          method="POST"
          action="?/delete"
          onsubmit={(e) => {
            if (!confirm('Are you sure you want to delete this account?')) {
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
        <h3>Account Information</h3>

        <Grid wrap={true} break="small">
          <Grid direction="column" gap="xs">
            <strong>Currency</strong>
            <span>{account.currency}</span>
          </Grid>

          <Grid direction="column" gap="xs">
            <strong>Status</strong>
            <span>{account.active ? 'Active' : 'Inactive'}</span>
          </Grid>

          <Grid direction="column" gap="xs">
            <strong>Created</strong>
            <span>{formatDate(account.created)}</span>
          </Grid>

          <Grid direction="column" gap="xs">
            <strong>Last Updated</strong>
            <span>{formatDate(account.updated)}</span>
          </Grid>
        </Grid>
      </Grid>
    </wa-card>

    {#if account.notes}
      <wa-card>
        <Grid direction="column" gap="s">
          <h3>Notes</h3>
          <p>{account.notes}</p>
        </Grid>
      </wa-card>
    {/if}

    <wa-card>
      <Grid direction="column" gap="s">
        <Grid align="center" gap="s">
          <wa-icon name="chart-pie" variant="solid"></wa-icon>
          <h3>Holdings & Transactions</h3>
        </Grid>
        <p>
          Holdings and transaction history linked to this account will appear here as entries are registered.
        </p>
      </Grid>
    </wa-card>
  </Grid>
</Grid>
