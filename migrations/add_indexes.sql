-- Add indexes to improve query performance
-- This will significantly speed up consultations API queries

-- Index on createdBy for faster user-specific queries
CREATE INDEX IF NOT EXISTS session_created_by_idx ON "sessionChatTable" ("createdBy");

-- Index on createdOn for faster sorting
CREATE INDEX IF NOT EXISTS session_created_on_idx ON "sessionChatTable" ("createdOn");

-- Analyze table to update statistics
ANALYZE "sessionChatTable";
