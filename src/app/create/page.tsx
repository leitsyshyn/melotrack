import { CreateGameForm } from "@/components/games/CreateGameForm";
import Game from "@/components/games/Game";
import { CreateRoundForm } from "@/components/rounds/CreateRoundForm";
import { RoundPlayer } from "@/components/rounds/RoundPlayer";
import { CreateTrackForm } from "@/components/tracks/CreateTrackForm";
import { getGamesWithRoundsWithTracks } from "@/queries/games";

export default async function CreatePage() {
  const games = await getGamesWithRoundsWithTracks();
  return (
    <div>
      <CreateGameForm />
      <CreateRoundForm gameId={1} position={1} />
      <CreateTrackForm roundId={1} />
      {games.map((game) => (
        <Game key={game.id} game={game} />
      ))}
      {games.length > 0 && games[0].rounds.length > 0 && (
        <RoundPlayer round={games[0].rounds[0]} />
      )}
    </div>
  );
}
