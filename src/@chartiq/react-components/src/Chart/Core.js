import React, { useState, useEffect, useRef } from "react";

// Import necessary ChartIQ library files
import { CIQ } from "chartiq/js/standard";
import "chartiq/js/components";
import "chartiq/js/addOns";

import ChartTemplate from "./Template";

// Base styles required by the library to render color correctly.
import "chartiq/css/normalize.css";
import "chartiq/css/stx-chart.css"; // Chart API
import "chartiq/css/chartiq.css"; // Chart UI
import "./library-overrides.css";

import { getCustomConfig } from "./resources"; // ChartIQ library resources

export { CIQ };

/**
 * This is a fully functional example showing how to load a chart with complete user interface.
 *
 * @export
 * @class Core
 * @extends {React.Component}
 */

const Core = (props) => {
	const [chart, setChart] = useState(new CIQ.UI.Chart());
	const [stx, setStx] = useState(null);
	const [config, setConfig] = useState();
	const container = useRef();
	const loading = useRef(true);

	useEffect(() => {

		if (loading.current) {
			const { config, resources, chartInitialized } = props;
			const configObj = getCustomConfig({ resources });
			CIQ.extend(config, configObj)

			// dev settings
			config.quoteFeeds[0].behavior.refreshInterval = 0
			config.themes.defaultTheme = "ciq-night"
			config.restore = false

			setConfig(config)

			const uiContext = chart.createChartAndUI({ container: container.current, config });
			uiContext.stx.ID = new Date().toISOString()

			setStx(uiContext.stx)
			setChart(uiContext)

			if (chartInitialized) {
				chartInitialized({ chartEngine: uiContext.stx, uiContext });
				loading.current = false
			}
		}



		return () => {
			if (stx) {
				console.log('destroying again ', stx.ID)
				// uiContext.stx.container.remove()
				stx.destroy();
				stx.draw = () => { };
				setStx(null)
				// uiContext.stx = null;
			}
		}
	}, [])

	return (
		<cq-context ref={container}>
			{props.children || <ChartTemplate config={config} />}
		</cq-context>
	);
}

export default Core;