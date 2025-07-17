import { CreateGameForm } from "@/components/games/CreateGameForm";
import Game from "@/components/games/Game";
import { Player } from "@/components/global/Player";
import { CreateRoundForm } from "@/components/rounds/CreateRoundForm";
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
      <Player />
    </div>
  );
}
