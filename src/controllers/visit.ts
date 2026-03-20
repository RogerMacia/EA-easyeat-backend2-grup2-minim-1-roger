import { NextFunction, Request, Response } from 'express';
import VisitService from '../services/visit';

const createVisit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const savedVisit = await VisitService.createVisit(req.body);
        return res.status(201).json(savedVisit);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readVisit = async (req: Request, res: Response, next: NextFunction) => {
    const visitId = req.params.visitId;
    try {
        const visit = await VisitService.getVisit(visitId);
        // Filtre de seguretat: si està borrada (soft delete), no la retornem
        if (visit && (visit as any).deletedAt) return res.status(404).json({ message: 'not found' });
        return visit ? res.status(200).json(visit) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    // 1️⃣ RECOLLIM PARÀMETRES DE PAGINACIÓ I FILTRES
    const { customer_id, restaurant_id } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    try {
        // 2️⃣ AFEGIM EL FILTRE DE SOFT DELETE (deletedAt: null)
        const filter = {
            customer_id: customer_id as string | undefined,
            restaurant_id: restaurant_id as string | undefined,
            deletedAt: null // <--- Només les que NO estiguin esborrades
        };

        // 3️⃣ CRIDEM AL SERVEI PASSANT PAGINACIÓ
        // Nota: Hauràs d'ajustar el teu VisitService.getAllVisits perquè accepti limit i skip
        const result = await VisitService.getAllVisits(filter, page, limit);
        
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const getVisitFull = async (req: Request, res: Response, next: NextFunction) => {
    const visitId = req.params.visitId;
    try {
        const visit = await VisitService.getVisitFull(visitId);
        return visit ? res.status(200).json(visit) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const updateVisit = async (req: Request, res: Response, next: NextFunction) => {
    const visitId = req.params.visitId;
    try {
        const updatedVisit = await VisitService.updateVisit(visitId, req.body);
        return updatedVisit ? res.status(200).json(updatedVisit) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const deleteVisit = async (req: Request, res: Response, next: NextFunction) => {
    const visitId = req.params.visitId;
    try {
        // HARD DELETE (L'existent)
        const visit = await VisitService.deleteVisit(visitId);
        return visit ? res.status(200).json(visit) : res.status(404).json({ message: 'not found' });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export default { createVisit, readVisit, readAll, getVisitFull, updateVisit, deleteVisit };