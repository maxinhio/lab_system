# E2E Test Runner

This script runs an automated end-to-end test against a running LABEXPRESS backend on `http://localhost:3000`.

Prerequisites:
- Backend server running.
- Demo users exist: `recepcion/Recep@123`, `flebotomista/Flebo@123`, `bioquimico/Bio@123`, `paciente/Patient@123`.

Run:

```bash
cd backend
node tools/e2e_test.js
```

Outputs: PDF files saved to `backend/tmp` and console logs.
