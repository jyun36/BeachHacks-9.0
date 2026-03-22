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

def get_improvements(avg_cn: float, avg_weeks: int, methane: str) -> list:
    tips = []

    # Tip 1: C:N / nitrogen balance
    if avg_cn < 15:
        tips.append("Your pile is very nitrogen-heavy. Add cardboard, wood chips, or dry leaves to balance it out.")
    elif avg_cn < 25:
        tips.append("Slightly too much nitrogen. Mix in some dry brown materials like paper or straw to improve balance.")
    elif avg_cn <= 30:
        tips.append("Your C:N ratio is in the ideal range. Keep adding a mix of greens and browns at your current pace.")
    elif avg_cn <= 60:
        tips.append("Your pile is slightly carbon-heavy. Add fruit scraps, coffee grounds, or fresh grass clippings.")
    else:
        tips.append("Too much carbon in your pile. Add nitrogen-rich materials like vegetable scraps or manure.")

    # Tip 2: Decomposition speed
    if avg_weeks <= 4:
        tips.append("Great decomposition rate! Your pile is breaking down quickly. Keep moisture consistent.")
    elif avg_weeks <= 8:
        tips.append("Decomposition is on track. Turn your pile every 3-4 days to maintain airflow and speed things up.")
    else:
        tips.append("Decomposition is slow. Chop items into smaller pieces and add water if the pile feels dry.")

    # Tip 3: Methane / aeration
    if methane == "Low":
        tips.append("Low methane output — your pile is aerobic and eco-friendly. Keep turning it regularly.")
    elif methane == "Medium":
        tips.append("Moderate methane detected. Increase aeration by turning your pile more frequently.")
    else:
        tips.append("High methane risk. Add carbon-rich dry materials and turn the pile every 2 days to reduce emissions.")

    # Tip 4: General optimization based on pile state
    if avg_cn < 25 and avg_weeks > 6:
        tips.append("Try layering green and brown materials instead of mixing randomly for faster breakdown.")
    elif avg_cn > 30 and methane != "Low":
        tips.append("Shred or tear materials before adding them to maximize surface area and microbial activity.")
    else:
        tips.append("Maintain moisture like a wrung-out sponge — not too wet, not too dry — for optimal composting.")

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
        improvements=get_improvements(avg_cn, avg_weeks, methane)
    )

@agent.on_event("startup")
async def startup(ctx: Context):
    ctx.logger.info(f"Compost advisor ready!")

if __name__ == "__main__":
    agent.run()
