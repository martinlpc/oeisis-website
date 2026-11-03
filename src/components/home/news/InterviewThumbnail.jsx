import { YouTubeEmbed } from '../../common/YouTubeEmbed'
import { getYouTubeId } from '../../../utils/youtube'

export function InterviewThumbnail({ externalLink, title }) {
    if (!getYouTubeId(externalLink)) return null

    return (
        <div className="mb-6 rounded-lg overflow-hidden aspect-video">
            <YouTubeEmbed url={externalLink} title={title} />
        </div>
    );
}
