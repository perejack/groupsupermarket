type Req = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
};

type Res = {
  status: (code: number) => Res;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => void;
};

export default function handler(req: Req, res: Res) {
  const origin = (req.headers?.origin as string | undefined) ?? "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).json({});
    return;
  }

  res.status(200).json({
    ok: true,
    route: "/api/hello",
    message: "Serverless functions are working.",
    method: req.method || "UNKNOWN",
  });
}

