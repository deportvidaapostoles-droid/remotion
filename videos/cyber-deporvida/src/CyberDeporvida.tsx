import {loadFont} from '@remotion/fonts';
import {
	AbsoluteFill,
	Easing,
	interpolate,
	Sequence,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

// Fonts are bundled locally so rendering does not depend on Google Fonts
const anton = 'Anton';
const montserrat = 'Montserrat';
loadFont({family: anton, url: staticFile('fonts/Anton.woff2')});
loadFont({
	family: montserrat,
	url: staticFile('fonts/Montserrat.woff2'),
	weight: '100 900',
});

const CYAN = '#00F0FF';
const MAGENTA = '#FF2BD6';
const GOLD = '#FFC93C';
const BG = '#07041A';

const SCENES = {
	cyber: {from: 0, duration: 90},
	vip: {from: 90, duration: 90},
	early: {from: 180, duration: 90},
	discount: {from: 270, duration: 90},
	cta: {from: 360, duration: 90},
};
export const DURATION = 450;

const neon = (color: string, strength = 1) =>
	`0 0 ${10 * strength}px ${color}, 0 0 ${30 * strength}px ${color}, 0 0 ${60 * strength}px ${color}`;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Fade out the last frames of every scene so cuts feel smooth
const useSceneExit = (duration: number) => {
	const frame = useCurrentFrame();
	return interpolate(frame, [duration - 8, duration], [1, 0], clamp);
};

const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const gridOffset = (frame * 6) % 120;
	const hue = interpolate(frame, [0, DURATION], [0, 40]);
	return (
		<AbsoluteFill style={{backgroundColor: BG, overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at 50% 30%, ${MAGENTA}55 0%, transparent 55%), radial-gradient(circle at 50% 85%, ${CYAN}44 0%, transparent 50%)`,
					filter: `hue-rotate(${hue}deg)`,
				}}
			/>
			{/* Perspective neon grid floor */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 0,
					height: 900,
					transform: 'perspective(500px) rotateX(55deg) scale(2.2)',
					transformOrigin: '50% 100%',
					backgroundImage: `linear-gradient(${CYAN}88 2px, transparent 2px), linear-gradient(90deg, ${CYAN}88 2px, transparent 2px)`,
					backgroundSize: '120px 120px',
					backgroundPosition: `0 ${gridOffset}px`,
					WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
				}}
			/>
			{/* Scanlines */}
			<AbsoluteFill
				style={{
					backgroundImage:
						'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px, transparent 2px, transparent 6px)',
				}}
			/>
		</AbsoluteFill>
	);
};

const GlitchText: React.FC<{
	text: string;
	size: number;
	color: string;
	glitch: number;
}> = ({text, size, color, glitch}) => {
	const frame = useCurrentFrame();
	const jitter = glitch * Math.sin(frame * 2.7) * 14;
	const base: React.CSSProperties = {
		fontFamily: anton,
		fontSize: size,
		lineHeight: 1,
		letterSpacing: 6,
		textTransform: 'uppercase',
	};
	return (
		<div style={{position: 'relative'}}>
			<div
				style={{
					...base,
					position: 'absolute',
					color: CYAN,
					transform: `translateX(${-jitter}px)`,
					opacity: glitch * 0.8,
					mixBlendMode: 'screen',
				}}
			>
				{text}
			</div>
			<div
				style={{
					...base,
					position: 'absolute',
					color: MAGENTA,
					transform: `translateX(${jitter}px)`,
					opacity: glitch * 0.8,
					mixBlendMode: 'screen',
				}}
			>
				{text}
			</div>
			<div style={{...base, position: 'relative', color, textShadow: neon(color === '#FFFFFF' ? MAGENTA : color, 0.4)}}>
				{text}
			</div>
		</div>
	);
};

const CyberScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const exit = useSceneExit(SCENES.cyber.duration);
	const slam = spring({frame, fps, config: {damping: 12, stiffness: 180}});
	const sub = spring({frame: frame - 18, fps, config: {damping: 14}});
	const glitch = interpolate(frame, [0, 14, 40, 44, 48], [1, 0, 0, 1, 0], clamp);
	const flash = interpolate(frame, [0, 6], [0.9, 0], clamp);

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: exit}}>
			<AbsoluteFill style={{backgroundColor: 'white', opacity: flash}} />
			<div style={{transform: `scale(${interpolate(slam, [0, 1], [3, 1])})`, opacity: slam}}>
				<GlitchText text="CYBER" size={330} color="#FFFFFF" glitch={glitch} />
			</div>
			<div
				style={{
					marginTop: 10,
					transform: `translateY(${interpolate(sub, [0, 1], [120, 0])}px)`,
					opacity: sub,
				}}
			>
				<GlitchText text="DEPORVIDA" size={190} color={MAGENTA} glitch={glitch * 0.6} />
			</div>
			<div
				style={{
					marginTop: 60,
					fontFamily: montserrat,
					fontWeight: 800,
					fontSize: 46,
					letterSpacing: 14,
					color: CYAN,
					textShadow: neon(CYAN, 0.4),
					opacity: interpolate(frame, [35, 50], [0, 1], clamp),
				}}
			>
				TIENDA ONLINE
			</div>
		</AbsoluteFill>
	);
};

const VipScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const exit = useSceneExit(SCENES.vip.duration);
	const enter = spring({frame, fps, config: {damping: 13, stiffness: 120}});
	const rotate = interpolate(enter, [0, 1], [-35, -6]);
	const shine = interpolate(frame, [20, 55], [-120, 220], clamp);
	const float = Math.sin(frame / 10) * 10;
	const label = spring({frame: frame - 25, fps, config: {damping: 15}});

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: exit}}>
			<div
				style={{
					fontFamily: montserrat,
					fontWeight: 900,
					fontSize: 58,
					letterSpacing: 10,
					color: 'white',
					marginBottom: 80,
					opacity: label,
					transform: `translateY(${interpolate(label, [0, 1], [-40, 0])}px)`,
				}}
			>
				TU ENTRADA EXCLUSIVA
			</div>
			<div
				style={{
					width: 860,
					height: 500,
					borderRadius: 40,
					position: 'relative',
					overflow: 'hidden',
					background: `linear-gradient(135deg, #2A1650 0%, #120A2E 60%, #3A0F45 100%)`,
					border: `5px solid ${GOLD}`,
					boxShadow: `${neon(GOLD, 0.8)}, inset 0 0 60px ${GOLD}44`,
					transform: `translateX(${interpolate(enter, [0, 1], [-1200, 0])}px) translateY(${float}px) rotate(${rotate}deg)`,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{/* Ticket notches */}
				{[-1, 1].map((side) => (
					<div
						key={side}
						style={{
							position: 'absolute',
							top: 210,
							[side < 0 ? 'left' : 'right']: -45,
							width: 90,
							height: 90,
							borderRadius: 45,
							backgroundColor: BG,
							border: `5px solid ${GOLD}`,
						}}
					/>
				))}
				<div
					style={{
						fontFamily: montserrat,
						fontWeight: 800,
						fontSize: 40,
						letterSpacing: 18,
						color: GOLD,
					}}
				>
					★ ★ ★
				</div>
				<div
					style={{
						fontFamily: anton,
						fontSize: 230,
						lineHeight: 1,
						color: GOLD,
						textShadow: neon(GOLD, 0.5),
					}}
				>
					PASE VIP
				</div>
				<div
					style={{
						fontFamily: montserrat,
						fontWeight: 600,
						fontSize: 34,
						letterSpacing: 8,
						color: 'white',
						marginTop: 10,
					}}
				>
					CYBER DEPORVIDA
				</div>
				{/* Light sweep */}
				<div
					style={{
						position: 'absolute',
						top: -100,
						bottom: -100,
						width: 140,
						left: `${shine}%`,
						transform: 'rotate(20deg)',
						background:
							'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};

const Lock: React.FC<{open: number}> = ({open}) => (
	<svg width={260} height={400} viewBox="0 -80 260 400">
		<path
			d="M60 150 V95 a70 70 0 0 1 140 0 V150"
			fill="none"
			stroke={CYAN}
			strokeWidth={26}
			strokeLinecap="round"
			transform={`translate(0 ${-open * 55}) rotate(${-open * 18} 60 150)`}
			style={{filter: `drop-shadow(0 0 14px ${CYAN})`}}
		/>
		<rect
			x={20}
			y={150}
			width={220}
			height={160}
			rx={30}
			fill={CYAN}
			style={{filter: `drop-shadow(0 0 20px ${CYAN})`}}
		/>
		<circle cx={130} cy={215} r={22} fill={BG} />
		<rect x={120} y={225} width={20} height={45} rx={8} fill={BG} />
	</svg>
);

const EarlyAccessScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const exit = useSceneExit(SCENES.early.duration);
	const lockIn = spring({frame, fps, config: {damping: 12}});
	const open = spring({frame: frame - 22, fps, config: {damping: 9, stiffness: 160}});
	const word1 = spring({frame: frame - 30, fps, config: {damping: 14}});
	const word2 = spring({frame: frame - 38, fps, config: {damping: 14}});
	const tag = interpolate(frame, [50, 62], [0, 1], clamp);
	const burst = interpolate(frame, [22, 45], [0, 1], {
		...clamp,
		easing: Easing.out(Easing.cubic),
	});

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: exit}}>
			<div style={{position: 'relative', transform: `scale(${lockIn})`}}>
				<div
					style={{
						position: 'absolute',
						left: 130 - 300,
						top: 200 - 300,
						width: 600,
						height: 600,
						borderRadius: 300,
						border: `6px solid ${MAGENTA}`,
						transform: `scale(${burst * 1.4})`,
						opacity: 1 - burst,
					}}
				/>
				<Lock open={open} />
			</div>
			{[
				{text: 'ACCESO', s: word1, color: 'white'},
				{text: 'ANTICIPADO', s: word2, color: MAGENTA},
			].map(({text, s, color}) => (
				<div
					key={text}
					style={{
						fontFamily: anton,
						fontSize: text === 'ACCESO' ? 210 : 170,
						lineHeight: 1.05,
						color,
						textShadow: neon(color === 'white' ? MAGENTA : color, 0.35),
						opacity: s,
						transform: `translateX(${interpolate(s, [0, 1], [text === 'ACCESO' ? -700 : 700, 0])}px)`,
					}}
				>
					{text}
				</div>
			))}
			<div
				style={{
					marginTop: 40,
					padding: '18px 44px',
					border: `3px solid ${CYAN}`,
					borderRadius: 60,
					fontFamily: montserrat,
					fontWeight: 800,
					fontSize: 42,
					letterSpacing: 4,
					color: CYAN,
					opacity: tag,
					transform: `scale(${interpolate(tag, [0, 1], [0.8, 1])})`,
				}}
			>
				COMPRÁ ANTES QUE NADIE
			</div>
		</AbsoluteFill>
	);
};

const DiscountScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const exit = useSceneExit(SCENES.discount.duration);
	const top = spring({frame, fps, config: {damping: 14}});
	const count = Math.round(
		interpolate(frame, [8, 40], [0, 50], {
			...clamp,
			easing: Easing.out(Easing.cubic),
		}),
	);
	const pop = spring({frame: frame - 40, fps, config: {damping: 7, stiffness: 220}});
	const scale = 1 + pop * 0.12 - interpolate(frame, [40, 70], [0, 0.12], clamp) * pop;
	const shake = frame >= 40 && frame < 48 ? Math.sin(frame * 9) * 10 : 0;
	const bottom = spring({frame: frame - 45, fps, config: {damping: 14}});

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: exit}}>
			<div
				style={{
					fontFamily: montserrat,
					fontWeight: 900,
					fontSize: 70,
					letterSpacing: 6,
					color: 'white',
					opacity: top,
					transform: `translateY(${interpolate(top, [0, 1], [-60, 0])}px)`,
				}}
			>
				PRODUCTOS CON
			</div>
			<div
				style={{
					fontFamily: montserrat,
					fontWeight: 900,
					fontSize: 70,
					letterSpacing: 6,
					color: CYAN,
					textShadow: neon(CYAN, 0.4),
					opacity: top,
				}}
			>
				DESCUENTOS
			</div>
			<div
				style={{
					fontFamily: anton,
					fontSize: 110,
					color: 'white',
					marginTop: 30,
					opacity: top,
				}}
			>
				HASTA
			</div>
			<div
				style={{
					display: 'flex',
					alignItems: 'flex-start',
					transform: `scale(${scale}) translateX(${shake}px)`,
				}}
			>
				<span
					style={{
						fontFamily: anton,
						fontSize: 440,
						lineHeight: 0.95,
						color: GOLD,
						textShadow: neon(MAGENTA, 0.9),
					}}
				>
					{count}
				</span>
				<span
					style={{
						fontFamily: anton,
						fontSize: 220,
						lineHeight: 1.1,
						color: GOLD,
						textShadow: neon(MAGENTA, 0.9),
					}}
				>
					%
				</span>
			</div>
			<div
				style={{
					marginTop: 10,
					backgroundColor: MAGENTA,
					padding: '10px 50px',
					transform: `skewX(-12deg) scaleX(${bottom})`,
					boxShadow: neon(MAGENTA, 0.6),
				}}
			>
				<span
					style={{
						fontFamily: anton,
						fontSize: 120,
						color: 'white',
						letterSpacing: 10,
						display: 'inline-block',
						transform: 'skewX(12deg)',
					}}
				>
					OFF
				</span>
			</div>
		</AbsoluteFill>
	);
};

const CtaScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = spring({frame, fps, config: {damping: 13}});
	const url = spring({frame: frame - 15, fps, config: {damping: 10, stiffness: 140}});
	const pulse = 1 + Math.sin(frame / 5) * 0.04 * interpolate(frame, [30, 40], [0, 1], clamp);
	const keywords = ['CYBER DEPORVIDA', 'PASE VIP', 'ACCESO ANTICIPADO'];

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			<div
				style={{
					fontFamily: montserrat,
					fontWeight: 800,
					fontSize: 54,
					letterSpacing: 8,
					color: 'white',
					opacity: enter,
				}}
			>
				ENTRÁ YA A
			</div>
			<div
				style={{
					marginTop: 30,
					padding: '40px 70px',
					borderRadius: 30,
					background: `linear-gradient(90deg, ${MAGENTA}, #8A2BFF, ${CYAN})`,
					boxShadow: neon(MAGENTA, 0.8),
					transform: `scale(${url * pulse})`,
				}}
			>
				<span style={{fontFamily: anton, fontSize: 150, color: 'white', letterSpacing: 2}}>
					deporvida.ar
				</span>
			</div>
			<div style={{marginTop: 90, display: 'flex', flexDirection: 'column', gap: 26}}>
				{keywords.map((k, i) => {
					const s = spring({frame: frame - 28 - i * 7, fps, config: {damping: 14}});
					return (
						<div
							key={k}
							style={{
								fontFamily: montserrat,
								fontWeight: 900,
								fontSize: 52,
								letterSpacing: 6,
								color: i === 1 ? GOLD : i === 2 ? CYAN : MAGENTA,
								textAlign: 'center',
								opacity: s,
								transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px)`,
							}}
						>
							#{k.replace(/ /g, '')}
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

export const CyberDeporvida: React.FC = () => {
	return (
		<AbsoluteFill>
			<Background />
			<Sequence from={SCENES.cyber.from} durationInFrames={SCENES.cyber.duration}>
				<CyberScene />
			</Sequence>
			<Sequence from={SCENES.vip.from} durationInFrames={SCENES.vip.duration}>
				<VipScene />
			</Sequence>
			<Sequence from={SCENES.early.from} durationInFrames={SCENES.early.duration}>
				<EarlyAccessScene />
			</Sequence>
			<Sequence from={SCENES.discount.from} durationInFrames={SCENES.discount.duration}>
				<DiscountScene />
			</Sequence>
			<Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.duration}>
				<CtaScene />
			</Sequence>
		</AbsoluteFill>
	);
};
