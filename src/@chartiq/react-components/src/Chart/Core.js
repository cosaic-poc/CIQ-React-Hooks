import React, { useState, useEffect, useRef } from "react";

// Import necessary ChartIQ library files
import { CIQ } from "chartiq/js/standard";
import "chartiq/js/components";
import "chartiq/js/componentUI";
import "chartiq/js/addOns";

import ChartTemplate from "./Template";

// Base styles required by the library to render color correctly.
import "chartiq/css/normalize.css";
import "chartiq/css/stx-chart.css"; // Chart API
import "chartiq/css/chartiq.css"; // Chart UI
import "./library-overrides.css";

import { getCustomConfig } from "./resources"; // ChartIQ library resources

export { CIQ };

const Core = (props) => {
	const [stx, setStx] = useState(null);
	const container = useRef();
	const loading = useRef(true);
	const { config, resources, chartInitialized } = props;
	const configObj = getCustomConfig({ resources });
	CIQ.extend(config, configObj)

	// dev settings
	config.quoteFeeds[0].behavior.refreshInterval = 0
	config.themes.defaultTheme = "ciq-night"
	config.restore = false

	const [chart] = useState(new CIQ.UI.Chart());

	useEffect(() => {
		if (loading.current) {

			const stx = chart.createChartAndUI({ container: container.current, config }).stx
			const uiContext = stx.uiContext
			setStx(stx)

			if (chartInitialized) {
				chartInitialized({ chartEngine: stx, uiContext });
				loading.current = false
			}
		}
		return () => {
			if (stx) {
				stx.destroy();
				stx.draw = () => { };
				setStx(null)
			}
		}
	}, [])

	return (
		<div>
			<cq-context ref={container}>
				{props.children || <ChartTemplate config={config} />}
			</cq-context>
		</div>
	);
}

export default Core;