import os
from uagents import Agent, Context, Model

class CompostRequest(Model):
    item: str
    compostable: bool

class CompostResponse(Model):
    score: int
    tip: str
    methane: str
    cn_ratio: str
    decomposition_time: str

compost_data = {
    "apple core":     {"cn_ratio": "high nitrogen", "methane": "low", "time": "2 months"},
    "banana peel":    {"cn_ratio": "high nitrogen", "methane": "low", "time": "1 month"},
    "cardboard":      {"cn_ratio": "high carbon",   "methane": "low", "time": "6 months"},
    "coffee grounds": {"cn_ratio": "high nitrogen", "methane": "low", "time": "3 months"},
}

agent = Agent(
    name="compost_advisor",
    seed=os.environ["AGENT_SEED"],
    port=8080,
    endpoint=["http://localhost:8080/submit"],
)

@agent.on_rest_post("/analyze", CompostRequest, CompostResponse)
async def analyze(ctx: Context, req: CompostRequest) -> CompostResponse:
    item = req.item.lower()

    if not req.compostable:
        return CompostResponse(
            score=0,
            tip=f"{item} is not compostable. Please dispose of it properly.",
            methane="N/A",
            cn_ratio="N/A",
            decomposition_time="N/A",
        )

    info = compost_data.get(item, {
        "cn_ratio": "unknown",
        "methane": "low",
        "time": "unknown"
    })

    return CompostResponse(
        score=85,
        tip=f"Great! {item} is a good addition to your pile.",
        methane=info["methane"],
        cn_ratio=info["cn_ratio"],
        decomposition_time=info["time"],
    )

@agent.on_event("startup")
async def startup(ctx: Context):
    ctx.logger.info(f"Compost advisor ready at {ctx.agent.address}")

if __name__ == "__main__":
    agent.run()