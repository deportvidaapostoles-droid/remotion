import {Composition} from 'remotion';
import {CyberDeporvida, DURATION} from './CyberDeporvida';

export const Root: React.FC = () => {
	return (
		<Composition
			id="CyberDeporvida"
			component={CyberDeporvida}
			durationInFrames={DURATION}
			fps={30}
			width={1080}
			height={1920}
		/>
	);
};
