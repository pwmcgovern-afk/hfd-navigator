-- Add pgvector embedding column to Resource for semantic search.
--
-- Run this once against your Supabase database (SQL editor or psql).
-- After the column exists, run `npx tsx prisma/embed.ts` to backfill
-- embeddings for all 192 existing resources, then redeploy.
--
-- The column lives outside the Prisma schema on purpose — the same pattern
-- the existing `search_vector` tsvector column uses. Prisma's Unsupported
-- type causes silent findUnique failures, so we manage this in raw SQL only.

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "Resource"
  ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- HNSW index for fast cosine-distance lookup. lists/probes tuned for ~200
-- rows; if the directory grows past ~10k resources, raise m=24, ef_construction=200.
CREATE INDEX IF NOT EXISTS resource_embedding_hnsw_idx
  ON "Resource"
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

COMMENT ON COLUMN "Resource".embedding IS
  'OpenAI text-embedding-3-small (1536 dims) of name + organization + description. Refresh via prisma/embed.ts.';
