# 5. High-Performance Aggregations Controller (backend/src/controllers/metricsController.ts)

TypeScript
import { Request, Response } from 'express';
import { PacketModel, AlertModel } from '../models/Schemas';
import { z } from 'zod';


export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Concurrent query orchestration to maximize thread utilization
    const [totalPackets, totalAlerts, protocolStats, topIps] = await Promise.all([
      PacketModel.countDocuments(),
      AlertModel.countDocuments({ resolved: false }),
      PacketModel.aggregate([
        { $group: { _id: '$protocol', count: { $sum: 1 } } }
      ]),
      PacketModel.aggregate([
        { $group: { _id: '$sourceIp', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);


    res.status(200).json({
      totalPackets,
      totalAlerts,
      protocolStats: protocolStats.map(p => ({ protocol: p._id, count: p.count })),
      topIps: topIps.map(ip => ({ ip: ip._id, count: ip.count }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failure resolving analytical metrics mapping aggregation pipelines.' });
  }
};


export const getFilteredLogs = async (req: Request, res: Response) => {
  try {
    // Input sanitization and strong schema type checking via Zod validations
    const QueryValidator = z.object({
      page: z.string().optional().default('1'),
      limit: z.string().optional().default('15'),
      protocol: z.string().optional(),
      sourceIp: z.string().optional()
    });


    const parsed = QueryValidator.parse(req.query);
    const page = parseInt(parsed.page, 10);
    const limit = parseInt(parsed.limit, 10);
    
    let dbFilter: any = {};
    if (parsed.protocol && parsed.protocol !== '') dbFilter.protocol = parsed.protocol;
    if (parsed.sourceIp && parsed.sourceIp !== '') {
      // Regex parsing bound strictly to prevent injection attempts
      dbFilter.sourceIp = { $regex: parsed.sourceIp.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), $options: 'i' };
    }


    const [logs, total] = await Promise.all([
      PacketModel.find(dbFilter)
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      PacketModel.countDocuments(dbFilter)
    ]);


    res.status(200).json({
      logs,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(400).json({ error: 'Malformed API Query Parameter Set Intercepted.' });
  }
};


