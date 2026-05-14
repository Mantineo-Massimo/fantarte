import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkScore() {
  const team = await prisma.team.findFirst({
    where: { name: { contains: 'biancuzzo' } },
    include: {
      artists: {
        include: {
          events: {
            orderBy: { createdAt: 'desc' }
          }
        }
      },
      leagues: true
    }
  });

  if (!team) {
    console.log("Team not found");
    return;
  }

  console.log(`Team: ${team.name}`);
  console.log(`Captain ID: ${team.captainId}`);
  
  let totalSum = 0;
  team.artists.forEach(artist => {
    console.log(`Artist: ${artist.name}, TotalScore: ${artist.totalScore}`);
    totalSum += artist.totalScore;
  });
  console.log(`Sum of totalScore: ${totalSum}`);

  team.leagues.forEach(l => {
    console.log(`League: ${l.leagueId}, Score: ${l.score}`);
  });

  const captain = team.artists.find(a => a.id === team.captainId);
  if (captain) {
    console.log(`Captain Name: ${captain.name}`);
    const specialPoints = captain.events
      .filter(e => (e.category === 'SPECIALE' || e.category === 'MALUS') && e.artistId !== null)
      .reduce((sum, e) => sum + e.points, 0);
    console.log(`Captain Special/Malus Points (assigned to artist): ${specialPoints}`);
    console.log(`Expected Team Score (Sum + Special): ${totalSum + specialPoints}`);
    
    console.log("\nCaptain Events:");
    captain.events.forEach(e => {
        console.log(` - [${e.category}] ${e.points}pt: ${e.description} (${e.createdAt})`);
    });
  }
}

checkScore()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
