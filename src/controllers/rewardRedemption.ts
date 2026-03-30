import { NextFunction, Request, Response } from 'express';
import RewardRedemptionService from '../services/rewardRedemption';

const createRewardRedemption = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const saved = await RewardRedemptionService.createRewardRedemption(req.body);
        return res.status(201).json(saved);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readRewardRedemption = async (req: Request, res: Response, next: NextFunction) => {
    const { redemptionId } = req.params;
    try {
        const redemption = await RewardRedemptionService.getRewardRedemption(redemptionId);
        return redemption ? res.status(200).json(redemption) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const redemptions = await RewardRedemptionService.getAllRewardRedemptions();
        return res.status(200).json(redemptions);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const updateRewardRedemption = async (req: Request, res: Response, next: NextFunction) => {
    const { redemptionId } = req.params;
    try {
        const updated = await RewardRedemptionService.updateRewardRedemption(redemptionId, req.body);
        return updated ? res.status(201).json(updated) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const deleteRewardRedemption = async (req: Request, res: Response, next: NextFunction) => {
    const { redemptionId } = req.params;
    try {
        const redemption = await RewardRedemptionService.deleteRewardRedemption(redemptionId);
        return redemption ? res.status(200).json(redemption) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export default { createRewardRedemption, readRewardRedemption, readAll, updateRewardRedemption, deleteRewardRedemption };
