CREATE TABLE "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"short_url" varchar(10) NOT NULL,
	"original_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "links_short_url_unique" UNIQUE("short_url")
);
