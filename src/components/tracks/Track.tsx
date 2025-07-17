import { TrackSelectType } from "@/lib/types";

export default function Track(track: TrackSelectType) {
  return (
    <div>
      {track.url} {track.title} {track.artist} {track.start} {track.end}
    </div>
  );
}
