ALTER TABLE "rounds" DROP CONSTRAINT "rounds_gameId_games_id_fk";
--> statement-breakpoint
ALTER TABLE "tracks" DROP CONSTRAINT "tracks_roundId_rounds_id_fk";
--> statement-breakpoint
ALTER TABLE "rounds" ADD CONSTRAINT "rounds_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_roundId_rounds_id_fk" FOREIGN KEY ("roundId") REFERENCES "public"."rounds"("id") ON DELETE cascade ON UPDATE no action;