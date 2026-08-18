import Router, { Route } from "preact-router";
import { Shell } from "./components/Shell";
import { Home } from "./screens/Home";
import { Itinerary } from "./screens/Itinerary";
import { DayDetail } from "./screens/DayDetail";
import { Destinations } from "./screens/Destinations";
import { DestinationDetail } from "./screens/DestinationDetail";
import { Handbook } from "./screens/Handbook";
import { OpsDashboard } from "./screens/OpsDashboard";
import { NotFound } from "./screens/NotFound";

export function App() {
  return (
    <Shell>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/lich-trinh" component={Itinerary} />
        <Route path="/lich-trinh/:daySlug" component={DayDetail} />
        <Route path="/diem-den" component={Destinations} />
        <Route path="/diem-den/:slug" component={DestinationDetail} />
        <Route path="/cam-nang" component={Handbook} />
        <Route path="/dieu-hanh" component={OpsDashboard} />
        <Route default component={NotFound} />
      </Router>
    </Shell>
  );
}
