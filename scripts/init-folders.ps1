$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot

$relativeDirs = @(
  '.',

  'apps',
  'apps/web',
  'apps/web/public',
  'apps/web/src',
  'apps/web/src/app',
  'apps/web/src/app/routes',
  'apps/web/src/app/providers',
  'apps/web/src/app/query',
  'apps/web/src/app/store',
  'apps/web/src/assets',
  'apps/web/src/components',
  'apps/web/src/components/ui',
  'apps/web/src/components/layout',
  'apps/web/src/features',
  'apps/web/src/features/auth',
  'apps/web/src/features/medicines',
  'apps/web/src/features/cart',
  'apps/web/src/features/checkout',
  'apps/web/src/features/orders',
  'apps/web/src/features/feedback',
  'apps/web/src/features/admin',
  'apps/web/src/features/delivery',
  'apps/web/src/hooks',
  'apps/web/src/lib',
  'apps/web/src/styles',
  'apps/web/src/utils',

  'apps/api',
  'apps/api/src',
  'apps/api/src/config',
  'apps/api/src/db',
  'apps/api/src/middlewares',
  'apps/api/src/modules',
  'apps/api/src/modules/auth',
  'apps/api/src/modules/users',
  'apps/api/src/modules/medicines',
  'apps/api/src/modules/cart',
  'apps/api/src/modules/orders',
  'apps/api/src/modules/payments',
  'apps/api/src/modules/feedback',
  'apps/api/src/modules/delivery',
  'apps/api/src/utils',

  'packages',
  'packages/shared',
  'packages/shared/src',
  'packages/shared/src/types',
  'packages/shared/src/schemas',

  'docs',
  'docs/requirements',
  'docs/api'
)

foreach ($dir in $relativeDirs) {
  $full = Join-Path $root $dir
  New-Item -ItemType Directory -Force -Path $full | Out-Null
}

Write-Output ('Created/verified ' + $relativeDirs.Count + ' directories under ' + $root)

