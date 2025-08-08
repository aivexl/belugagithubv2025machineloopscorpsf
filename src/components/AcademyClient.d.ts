import { SanityArticleWithImage } from '../utils/sanity';

interface AcademyClientProps {
  articles?: SanityArticleWithImage[];
}

declare function AcademyClient(props: AcademyClientProps): JSX.Element;

export default AcademyClient; 