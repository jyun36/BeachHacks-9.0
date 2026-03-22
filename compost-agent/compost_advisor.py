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

def get_improvements(items, avg_cn: float, avg_weeks: int, methane: str) -> list:
    tips = []
    count = len(items)
    high_carbon = [i.item for i in items if i.cn_ratio > 40]
    high_nitrogen = [i.item for i in items if i.cn_ratio < 20]
    slow_items = [i.item for i in items if i.decomp_weeks > 10]

    # Tip 1: C:N balance — references specific items and real numbers
    if avg_cn < 15:
        if high_nitrogen:
            tips.append(f"Items like {high_nitrogen[0]} are making your pile very nitrogen-heavy (C:N {round(avg_cn)}:1). Add cardboard or wood chips to balance.")
        else:
            tips.append(f"C:N ratio of {round(avg_cn)}:1 is too low. Layer in dry brown materials like straw or shredded paper between your greens.")
    elif avg_cn < 25:
        tips.append(f"Your {count}-item pile sits at {round(avg_cn)}:1 — slightly nitrogen-heavy. Add some dry leaves or torn cardboard to push toward the ideal 25-30 range.")
    elif avg_cn <= 30:
        tips.append(f"Perfect balance — your {count}-item pile has a C:N ratio of {round(avg_cn)}:1, right in the sweet spot. Keep mixing greens and browns at this pace.")
    elif avg_cn <= 60:
        if high_carbon:
            tips.append(f"Items like {high_carbon[0]} are pulling your C:N to {round(avg_cn)}:1. Balance them out with fruit scraps, coffee grounds, or fresh grass clippings.")
        else:
            tips.append(f"C:N of {round(avg_cn)}:1 is carbon-heavy across your {count} items. Add nitrogen-rich scraps like vegetable peels or banana skins.")
    else:
        tips.append(f"C:N ratio of {round(avg_cn)}:1 is too carbon-heavy. Your pile needs significantly more nitrogen — add food scraps, grass clippings, or coffee grounds daily.")

    # Tip 2: Decomposition — references slow items by name
    if avg_weeks <= 4:
        tips.append(f"Excellent decomp rate — your pile should be ready in ~{avg_weeks} weeks. Turn it every 3 days to keep oxygen flowing.")
    elif avg_weeks <= 8:
        if slow_items:
            tips.append(f"{slow_items[0].capitalize()} is slowing things down. Chop it into smaller pieces to cut your estimated {avg_weeks}-week timeline significantly.")
        else:
            tips.append(f"Estimated ~{avg_weeks} weeks to compost. Turn the pile every 3-4 days and keep moisture consistent to speed things up.")
    else:
        tips.append(f"At ~{avg_weeks} weeks your decomposition is slow. Break larger items into pieces, add a nitrogen boost, and turn the pile more frequently.")

    # Tip 3: Methane / aeration
    if methane == "Low":
        tips.append(f"Low methane across all {count} items — your pile is aerobic and eco-friendly. Maintain airflow by turning it regularly.")
    elif methane == "Medium":
        tips.append("Moderate methane detected. Add dry carbon materials between layers and turn the pile every 2-3 days to restore aerobic conditions.")
    else:
        tips.append("High methane risk — your pile is going anaerobic. Add dry materials immediately, aerate daily, and avoid compacting the pile.")

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
        improvements=get_improvements(req.items, avg_cn, avg_weeks, methane)
    )

@agent.on_event("startup")
async def startup(ctx: Context):
    ctx.logger.info(f"Compost advisor ready!")

if __name__ == "__main__":
    agent.run()
