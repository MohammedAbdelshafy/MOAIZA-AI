---
type: repository
status: candidate
owner_repo: MohammedAbdelshafy/MOAIZA-AI
product_name: MOAIZA-AI
source_of_truth: https://github.com/MohammedAbdelshafy/MOAIZA-AI
---

# MOAIZA-AI CONTEXT

One job: help construction teams organize tender documents, bills of quantities, estimates and missing-information flags. The repository's current production readiness must be verified before customer use.

## Inputs
- Project scope and setup: [README](README.md)
- Application code: [app](app/)
- Configuration and environment: [README environment section](README.md)

## Process
1. Confirm the current build and required services.
2. Use sample or authorized tender documents only.
3. Keep extracted quantities separate from manually verified values.
4. Show the inputs and assumptions behind every estimate.
5. Flag missing prices and uncertain quantities for a qualified estimator.
6. Review authentication, tenant separation, file retention and deployment before live customer data.

## Output
A draft tender summary, BOQ review, estimate and list of open questions within the capabilities actually implemented.

## Check
Run the documented tests and verify each advertised feature against the code and runtime. Do not describe output as a winning bid, verified supplier price or professional engineering approval.
