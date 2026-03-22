from uagents import Agent, Context, Model
from typing import List
import os

class PileItem(Model):
    item: str
    cn_ratio: float
    decomp_weeks: int
    methane: str

class PileRequest(Model):
    items: List[PileItem]

class PileResponse(Model):
    score: int
    status: str
    avg_cn: float
    methane: str
    decomp_weeks: int
    improvements: List[str]

def calculate_score(avg_cn: float) -> int:
    diff = abs(avg_cn - 27.5)
    return max(0, round(100 - diff * 1.5))

def get_status(avg_cn: float) -> str:
    if avg_cn < 15:   return "Too Nitrogen-Heavy"
    if avg_cn < 25:   return "Slightly Nitrogen-Heavy"
    if avg_cn <= 30:  return "Excellent Condition"
    if avg_cn <= 60:  return "Slightly Carbon-Heavy"
    return "Too Carbon-Heavy"

def get_improvements(avg_cn: float) -> list:
    tips = []
    if avg_cn < 20:
        tips.append("Add more carbon-rich materials like cardboard or dry leaves")
    elif avg_cn > 40:
        tips.append("Add more nitrogen-rich materials like fruit scraps or coffee grounds")
    else:
        tips.append("Your C:N ratio is perfect! Keep it up")
    tips.append("Turn your pile every 3-4 days for airflow")
    tips.append("Chop items smaller to speed up decomposition by 30%")
    return tips

agent = Agent(
    name="compost_advisor",
    seed=os.environ.get("AGENT_SEED", "compost_seed"),
    port=8080,
    endpoint=["http://localhost:8080/submit"],
)

@agent.on_rest_post("/analyze", PileRequest, PileResponse)
async def analyze(ctx: Context, req: PileRequest) -> PileResponse:
    if not req.items:
        return PileResponse(
            score=0, status="Empty Pile", avg_cn=0,
            methane="N/A", decomp_weeks=0,
            improvements=["Start scanning items to build your pile!"]
        )

    avg_cn = round(sum(i.cn_ratio for i in req.items) / len(req.items), 1)
    avg_weeks = round(sum(i.decomp_weeks for i in req.items) / len(req.items))
    methane_levels = [i.methane for i in req.items]
    methane = "High" if "high" in methane_levels else "Medium" if "medium" in methane_levels else "Low"

    return PileResponse(
        score=calculate_score(avg_cn),
        status=get_status(avg_cn),
        avg_cn=avg_cn,
        methane=methane,
        decomp_weeks=avg_weeks,
        improvements=get_improvements(avg_cn)
    )

@agent.on_event("startup")
async def startup(ctx: Context):
    ctx.logger.info(f"Compost advisor ready!")

if __name__ == "__main__":
    agent.run()
