CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"family_name" text,
	"profile_pic" text,
	"email" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
