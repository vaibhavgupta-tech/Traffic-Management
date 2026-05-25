# 4. Controller Layer (backend/src/controllers/metricsController.ts)

TypeScript
import { Request, Response } from 'express';
import { PacketModel, AlertModel } from '../models/Schemas';
import { z } from 'zod';


export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalPackets = await PacketModel.countDocuments();
    const totalAlerts = await AlertModel.countDocuments({ resolved: false });


    // Aggregations
    const protocolStats = await PacketModel.aggregate([
      { $group: { _id: '$protocol', count: { $sum: 1 } } }
    ]);


    const topIps = await PacketModel.aggregate([
      { $group: { _id: '$sourceIp', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);


    res.json({
      totalPackets,
      totalAlerts,
      protocolStats: protocolStats.map(p => ({ protocol: p._id, count: p.count })),
      topIps: topIps.map(ip => ({ ip: ip._id, count: ip.count }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to aggregate SOC stats' });
  }
};


export const getFilteredLogs = async (req: Request, res: Response) => {
  try {
    const QuerySchema = z.object({
      page: z.string().optional().default('1'),
      limit: z.string().optional().default('20'),
      protocol: z.string().optional(),
      sourceIp: z.string().optional()
    });


    const parsed = QuerySchema.parse(req.query);
    const page = parseInt(parsed.page);
    const limit = parseInt(parsed.limit);
    
    let filterQuery: any = {};
    if (parsed.protocol) filterQuery.protocol = parsed.protocol;
    if (parsed.sourceIp) filterQuery.sourceIp = { $regex: parsed.sourceIp, $options: 'i' };


    const logs = await PacketModel.find(filterQuery)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);


    const total = await PacketModel.countDocuments(filterQuery);


    res.json({ logs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(400).json({ error: 'Invalid search parameters' });
  }
};


