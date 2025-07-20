CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"gap" integer DEFAULT 5 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rounds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"gap" integer DEFAULT 3 NOT NULL,
	"position" serial NOT NULL,
	CONSTRAINT "rounds_gameId_position_unique" UNIQUE("gameId","position") DEFERRABLE INITIALLY DEFERRED,
	CONSTRAINT "round_pos_non_negative" CHECK ("rounds"."position" >= 0)
);
--> statement-breakpoint
CREATE TABLE "tracks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"roundId" uuid NOT NULL,
	"position" serial NOT NULL,
	"url" varchar(2048) NOT NULL,
	"start" integer NOT NULL,
	"end" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"artist" varchar(255),
	CONSTRAINT "tracks_roundId_position_unique" UNIQUE("roundId","position") DEFERRABLE INITIALLY DEFERRED,
	CONSTRAINT "track_pos_non_negative" CHECK ("tracks"."position" >= 0),
	CONSTRAINT "url_valid" CHECK ("tracks"."url" ~* '^https?://[\w.-]+(?:\.[\w.-]+)+(:\d+)?(/[^\s]*)?$'),
	CONSTRAINT "start_non_negative" CHECK ("tracks"."start" >= 0),
	CONSTRAINT "end_non_negative" CHECK ("tracks"."end" >= 0),
	CONSTRAINT "end_after_start" CHECK ("tracks"."end" > "tracks"."start")
);
--> statement-breakpoint
ALTER TABLE "rounds" ADD CONSTRAINT "rounds_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_roundId_rounds_id_fk" FOREIGN KEY ("roundId") REFERENCES "public"."rounds"("id") ON DELETE no action ON UPDATE no action;