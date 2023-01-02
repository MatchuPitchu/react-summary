import { FC, useEffect, useState } from 'react';
import { delayRender, continueRender } from 'remotion';
import { Title } from './Title';

type WeatherData = {
	day: string;
	geo: {
		lat: number;
		lng: number;
	};
	maxTemperature: number;
	minTemperature: number;
};

export const FetchedTitle: FC = () => {
	const [weatherData, setWeatherData] = useState<WeatherData>();
	// delayRender() returns a handle. Once you have fetched data or finished the async task,
	// call continueRender(handle) to let remotion know that you are now ready to render
	const [handle] = useState(() => delayRender());

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min&timezone=auto'
				);
				const data = await response.json();
				setWeatherData({
					day: new Date(data.daily.time[0]).toLocaleString('de-DE', {
						timeZone: 'Europe/Berlin',
						dateStyle: 'medium',
					}),
					geo: {
						lat: data.latitude,
						lng: data.longitude,
					},
					maxTemperature: data.daily.temperature_2m_max[0],
					minTemperature: data.daily.temperature_2m_min[0],
				});

				continueRender(handle);
			} catch (error) {
				console.log(error);
			}
		};

		fetchData();
	}, []);

	if (!weatherData) return null;

	return (
		<Title>
			{`${weatherData.day} (${weatherData.geo.lat}, ${weatherData.geo.lng}}`}:
			min. {weatherData.minTemperature} C°, max. {weatherData.maxTemperature} C°
		</Title>
	);
};
