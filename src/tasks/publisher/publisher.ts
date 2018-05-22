import {logger} from "../../config/logger";

export class PublisherCron {

    public interval = "1MIN";

    public start() {
        logger.info("Publisher cron started...");

        try {

            // Get all active campaigns
            // Get all ads
            // Get statistics
            // Dummy
            // Publish

            logger.info("StatsModel cron finished");
        } catch (err) {
            logger.info("StatsModel cron error:");
            logger.error(err);
            throw new Error(err);
        }
    }
}
