import {Stats} from "../../models/stats/stats.model";
import {NormalizedStats} from "../models/normalizedStats";

export default class Normalizer {

    public async normalize(stats: Stats[]): Promise<NormalizedStats[]> {

        const normalizedStats: NormalizedStats[] = [];

        await Promise.all(stats.map(async (stat) => {
            await Promise.all(stat.statistics.map(async (statistic) => {
                let CTR = {
                    clicks: statistic.clicks,
                    impressions: statistic.impressions,
                };

                // Other properties to be interpreted as clicks
                if (statistic.app_clicks) {
                    CTR = {clicks: statistic.app_clicks, impressions: statistic.impressions};
                }

                // Find if normalizedStat Campaign already exist
                const NORMALIZED_CAMPAIGN = normalizedStats.find(
                    (normalized) => normalized.campaign === stat.campaign,
                );

                // Campaign exists
                if (NORMALIZED_CAMPAIGN && NORMALIZED_CAMPAIGN !== undefined) {
                    // Find if normalizedStat Ad already exist
                    const NORMALIZED_AD = NORMALIZED_CAMPAIGN.stats.find(
                        (normalizedStat) => normalizedStat.ad === statistic.ad,
                    );
                    // Ad exists
                    if (NORMALIZED_AD && NORMALIZED_AD !== undefined) {
                        normalizedStats.find(
                            (normalized) => normalized.campaign === stat.campaign).stats.find(
                            (statAd) => statAd.ad === statistic.ad,
                        ).CTR = {
                            clicks: NORMALIZED_AD.CTR.clicks + CTR.clicks,
                            impressions: NORMALIZED_AD.CTR.impressions + CTR.impressions,
                        };
                        // Ad doesn't exist, create new
                    } else {
                        normalizedStats.find(
                            (normalized) => normalized.campaign === stat.campaign,
                        ).stats.push({
                            ad: statistic.ad,
                            CTR: {
                                clicks: CTR.clicks,
                                impressions: CTR.impressions,
                            },
                        });
                    }
                    // Campaign doesn't exist, create new
                } else {
                    normalizedStats.push({
                        campaign: stat.campaign,
                        stats: [{
                            ad: statistic.ad,
                            CTR: {
                                clicks: CTR.clicks,
                                impressions: CTR.impressions,
                            },
                        }],
                    });
                }
            }));
        }));

        return normalizedStats;
    }
}
