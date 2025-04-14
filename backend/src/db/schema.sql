/**
 * BILLING TIERS TABLE
 * Contains billing tier information such as name, threshold, and fee percentage.
 */
CREATE TABLE IF NOT EXISTS billing_tiers (
  id SERIAL PRIMARY KEY, /* Internal PK (indexing, joins, relationships) */
  external_tier_id TEXT UNIQUE NOT NULL /* External Client ID from .csv. Used as FK in clients table */
);

/**
 * TIER RANGES TABLE
 * Contains the ranges and fee percentages for each tier.
 */
CREATE TABLE IF NOT EXISTS billing_tier_ranges (
  id SERIAL PRIMARY KEY,
  billing_tier_id INTEGER REFERENCES billing_tiers(id), /* FK to billing_tiers. Each tier range belongs to a billing tier */
  portfolio_aum_min DECIMAL(19,4) NOT NULL,
  portfolio_aum_max DECIMAL(19,4) NOT NULL,
  fee_percentage DECIMAL(5,4) NOT NULL,
  UNIQUE (billing_tier_id, portfolio_aum_min, portfolio_aum_max) /* Validate no duplicate ranges for the same billing tier */
);

/**
 * CLIENTS TABLE
 * Contains client information such as name, province, country, and associated billing tier.
 */
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY, /* Internal PK (indexing, joins, relationships) */
  external_client_id TEXT UNIQUE NOT NULL, /* External Client ID from .csv, e.g. 'C001'. Used as FK in portfolios table */
  client_name TEXT NOT NULL,
  province TEXT,
  country TEXT,
  billing_tier_id INTEGER REFERENCES billing_tiers(id) /* FK to billing_tiers. Each client is assigned a billing tier */
);

/**
 * PORTFOLIOS TABLE
 * Contains portfolio ID, portfolio currency, and client ID to reference the client table.
 */
CREATE TABLE IF NOT EXISTS portfolios (
  id SERIAL PRIMARY KEY, /* Internal PK (indexing, joins, relationships) */
  external_portfolio_id TEXT UNIQUE NOT NULL, /* External Client ID from .csv (e.g. 'P001'). Used as FK in assets table */
  client_id INTEGER REFERENCES clients(id), /* FK to clients(id). Each portfolio belongs to a client */
  currency TEXT NOT NULL
);

/**
 * ASSETS TABLE
 * Contains asset values under each portfolio as of Dec. 31, 2024.
 */
CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY, /* Internal PK (indexing, joins, relationships) */
  portfolio_id INTEGER REFERENCES portfolios(id), /* FK to portfolios(id). Each asset is linked to a portfolio */
  asset_id TEXT NOT NULL, /* We don't need to store an external/internal ID for assets because we are joining by `portfolio_id` and it is not currently referenced anywhere */           
  asset_value DECIMAL(19,4) NOT NULL,                  
  currency TEXT NOT NULL,
  date DATE NOT NULL                              
);

/**
 * NON-UNIQUE INDEXES
 * We use these indexes to optimize the performance of the queries that are needed to calculate the fee for each client
 */
CREATE INDEX IX_clients_billing_tier_id ON clients(billing_tier_id); /* For fee lookups */
CREATE INDEX IX_portfolios_client_id ON portfolios(client_id); /* For client AUM aggregation */
CREATE INDEX IX_assets_portfolio_id ON assets(portfolio_id); /* For portfolio value calculation */
CREATE INDEX IX_assets_date ON assets(date); /* For date filtering */