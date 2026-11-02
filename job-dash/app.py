"""
app.py - Ant Design Enterprise Analytics Dashboard
Conforms to BRD_Dashboard_Spec.md & style_guide.md
Senior Full-Stack & Data Engineering Implementation
Features:
- Ant Design Theme (#001529 Sidebar, #1890ff Accent, #f0f2f5 Canvas)
- Full Live Database Integration via database.py
- Production-Ready Interactive Callbacks (Period filters, DateRangePicker, Sales/Visits tabs)
- Live Data Pipeline Status Engine (Connection health & Real-time sync timestamps)
"""

import os
import datetime
from datetime import timedelta
import dash
from dash import dcc, html, Input, Output, State, callback_context
import plotly.graph_objects as go
import pandas as pd

# Import Database Integration Layer
import database

# ==============================================================================
# DASH INITIALIZATION & ANT DESIGN ASSETS
# ==============================================================================

app = dash.Dash(
    __name__,
    suppress_callback_exceptions=True,
    external_stylesheets=[
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
        "https://fonts.googleapis.com/css2?family=-apple-system,BlinkMacSystemFont,Segoe+UI,Roboto,Helvetica+Neue,Arial,sans-serif&display=swap"
    ]
)
app.title = "Antigravity Analytics | Ant Design Dashboard"
server = app.server

# Custom Ant Design CSS Injection
ANT_CSS = {
    "sidebar": {
        "width": "220px",
        "minWidth": "220px",
        "backgroundColor": "#001529",
        "minHeight": "100vh",
        "transition": "all 0.2s ease",
        "zIndex": 100,
        "boxShadow": "2px 0 8px 0 rgba(29,35,41,0.05)"
    },
    "header": {
        "height": "64px",
        "backgroundColor": "#ffffff",
        "borderBottom": "1px solid #f0f0f0",
        "boxShadow": "0 1px 4px rgba(0,21,41,0.08)",
        "padding": "0 24px"
    },
    "card": {
        "backgroundColor": "#ffffff",
        "borderRadius": "2px",
        "border": "1px solid #f0f0f0",
        "boxShadow": "0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12)",
        "padding": "20px 24px 8px 24px",
        "height": "100%"
    },
    "font": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
}

# ==============================================================================
# HELPER COMPONENTS (ANT DESIGN STYLE)
# ==============================================================================

def make_sidebar():
    """Generates the 220px dark navy (#001529) Ant Design Sidebar."""
    return html.Div([
        # Logo & Brand
        html.Div([
            html.Div([
                html.Span("▲", style={"color": "#1890ff", "fontSize": "22px", "fontWeight": "bold", "marginRight": "8px"}),
                html.Span("Ant Design Pro", style={"color": "#ffffff", "fontSize": "16px", "fontWeight": "600", "letterSpacing": "0.5px"})
            ], className="d-flex align-items-center justify-content-center py-3 border-bottom", style={"borderColor": "rgba(255,255,255,0.1)"})
        ]),

        # Navigation Menu Items
        html.Div([
            html.Div([
                html.Span("📊", className="me-3"),
                html.Span("Dashboard", className="fw-semibold")
            ], className="d-flex align-items-center text-white px-3 py-2 mt-2", style={"backgroundColor": "#1890ff", "borderRadius": "4px", "cursor": "pointer"}),

            html.Div([
                html.Span("📈", className="me-3"),
                html.Span("Analysis")
            ], className="d-flex align-items-center text-white-50 px-3 py-2 mt-1", style={"cursor": "pointer"}),

            html.Div([
                html.Span("🖥️", className="me-3"),
                html.Span("Monitor")
            ], className="d-flex align-items-center text-white-50 px-3 py-2 mt-1", style={"cursor": "pointer"}),

            html.Div([
                html.Span("🏢", className="me-3"),
                html.Span("Workplace")
            ], className="d-flex align-items-center text-white-50 px-3 py-2 mt-1", style={"cursor": "pointer"}),

            html.Hr(style={"borderColor": "rgba(255,255,255,0.15)"}),

            html.Div([
                html.Small("DATA PIPELINE", className="text-secondary fw-bold px-3", style={"fontSize": "10px", "letterSpacing": "1px"}),
                html.Div([
                    html.Span("🗄️", className="me-2"),
                    html.Span("SQL Database", className="small")
                ], className="text-white-50 px-3 py-1 mt-1"),
                html.Div([
                    html.Span("⚡", className="me-2"),
                    html.Span("Realtime Engine", className="small")
                ], className="text-white-50 px-3 py-1")
            ])
        ], className="px-2 mt-3")
    ], style=ANT_CSS["sidebar"], className="d-none d-md-block")


def make_header():
    """Generates the Ant Design Header with Live Data Pipeline Status Engine."""
    return html.Header([
        html.Div([
            # Left: Breadcrumb
            html.Div([
                html.Span("Home", className="text-muted small me-2"),
                html.Span("/", className="text-muted small me-2"),
                html.Span("Dashboard", className="text-muted small me-2"),
                html.Span("/", className="text-muted small me-2"),
                html.Span("Analysis", className="text-dark small fw-semibold")
            ], className="d-flex align-items-center"),

            # Right: Live Pipeline Status Pill & Profile
            html.Div([
                # Real-time Status Badge
                html.Div(id="live-status-pill", className="d-flex align-items-center me-3 px-2.5 py-1 rounded-pill", style={"backgroundColor": "#f6ffed", "border": "1px solid #b7eb8f"}, children=[
                    html.Span(className="me-1.5", style={"width": "8px", "height": "8px", "backgroundColor": "#52c41a", "borderRadius": "50%", "display": "inline-block"}),
                    html.Span("LIVE DATA CONNECTED", id="status-text", className="fw-bold me-2", style={"fontSize": "11px", "color": "#52c41a"}),
                    html.Span(id="last-sync-timestamp", className="text-muted", style={"fontSize": "10.5px"})
                ]),

                # User Profile Avatar
                html.Div([
                    html.Div("SM", className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2 fw-bold", style={"width": "30px", "height": "30px", "fontSize": "12px"}),
                    html.Span("Serati Ma", className="small fw-semibold text-secondary")
                ], className="d-flex align-items-center ps-2 border-start")
            ], className="d-flex align-items-center")
        ], className="d-flex justify-content-between align-items-center h-100")
    ], style=ANT_CSS["header"])


# ==============================================================================
# MAIN APPLICATION LAYOUT
# ==============================================================================

app.layout = html.Div([
    # Polling heartbeat interval (re-checks DB & updates last sync every 30s)
    dcc.Interval(id="interval-heartbeat", interval=30*1000, n_intervals=0),

    # Stored state for period filter
    dcc.Store(id="store-period-filter", data="All month"),

    html.Div([
        # 1. Sidebar (Fixed 220px, #001529)
        make_sidebar(),

        # 2. Main Content Wrapper
        html.Div([
            # Top Header with Status Engine
            make_header(),

            # Dashboard Canvas (#f0f2f5)
            html.Main([
                # ==============================================================
                # ROW 1: 4 ANT DESIGN KPI SUMMARY CARDS
                # ==============================================================
                html.Div([
                    # KPI 1: Total Sales
                    html.Div([
                        html.Div([
                            html.Div([
                                html.Span("Total Sales", className="text-secondary small fw-medium"),
                                html.Span("ⓘ", className="text-muted small float-end cursor-pointer", title="Aggregated store revenue within period")
                            ]),
                            html.H3("¥ 126,560", id="kpi-sales-amount", className="fw-bolder my-2 text-dark", style={"fontSize": "28px"}),
                            html.Div([
                                html.Span("WoW ", className="text-secondary small"),
                                html.Span("12% ↑", id="kpi-sales-wow", className="small text-danger fw-semibold me-3"),
                                html.Span("DoD ", className="text-secondary small"),
                                html.Span("11% ↓", id="kpi-sales-dod", className="small text-success fw-semibold")
                            ], className="mb-2", style={"fontSize": "12px"}),
                            html.Hr(className="my-2", style={"borderColor": "#f0f0f0"}),
                            html.Div([
                                html.Span("Daily Sales ", className="text-secondary small"),
                                html.Span("¥ 12,423", id="kpi-sales-daily", className="text-dark small fw-semibold")
                            ], style={"fontSize": "12px"})
                        ], style=ANT_CSS["card"])
                    ], className="col-lg-3 col-sm-6 mb-3"),

                    # KPI 2: Visits + Sparkline Area Chart
                    html.Div([
                        html.Div([
                            html.Div([
                                html.Span("Visits", className="text-secondary small fw-medium"),
                                html.Span("ⓘ", className="text-muted small float-end cursor-pointer")
                            ]),
                            html.H3("8,846", id="kpi-visits-count", className="fw-bolder my-2 text-dark", style={"fontSize": "28px"}),
                            html.Div([
                                dcc.Graph(id="sparkline-visits", config={"displayModeBar": False}, style={"height": "46px"})
                            ]),
                            html.Hr(className="my-2", style={"borderColor": "#f0f0f0"}),
                            html.Div([
                                html.Span("Daily Visits ", className="text-secondary small"),
                                html.Span("1,234", id="kpi-visits-daily", className="text-dark small fw-semibold")
                            ], style={"fontSize": "12px"})
                        ], style=ANT_CSS["card"])
                    ], className="col-lg-3 col-sm-6 mb-3"),

                    # KPI 3: Payments + Sparkline Bar Chart
                    html.Div([
                        html.Div([
                            html.Div([
                                html.Span("Payments", className="text-secondary small fw-medium"),
                                html.Span("ⓘ", className="text-muted small float-end cursor-pointer")
                            ]),
                            html.H3("6,560", id="kpi-payments-count", className="fw-bolder my-2 text-dark", style={"fontSize": "28px"}),
                            html.Div([
                                dcc.Graph(id="sparkline-payments", config={"displayModeBar": False}, style={"height": "46px"})
                            ]),
                            html.Hr(className="my-2", style={"borderColor": "#f0f0f0"}),
                            html.Div([
                                html.Span("Conversion Rate ", className="text-secondary small"),
                                html.Span("60%", id="kpi-conversion-rate", className="text-dark small fw-semibold")
                            ], style={"fontSize": "12px"})
                        ], style=ANT_CSS["card"])
                    ], className="col-lg-3 col-sm-6 mb-3"),

                    # KPI 4: Operational Effect + Progress Bar
                    html.Div([
                        html.Div([
                            html.Div([
                                html.Span("Operational Effect", className="text-secondary small fw-medium"),
                                html.Span("ⓘ", className="text-muted small float-end cursor-pointer")
                            ]),
                            html.H3("78%", id="kpi-op-rate", className="fw-bolder my-2 text-dark", style={"fontSize": "28px"}),
                            html.Div([
                                html.Div([
                                    html.Div(id="progress-op-bar", className="progress-bar", style={"width": "78%", "backgroundColor": "#1890ff", "borderRadius": "2px"})
                                ], className="progress my-3", style={"height": "8px", "backgroundColor": "#f5f5f5"})
                            ]),
                            html.Hr(className="my-2", style={"borderColor": "#f0f0f0"}),
                            html.Div([
                                html.Span("WoW ", className="text-secondary small"),
                                html.Span("12% ↑", id="kpi-op-wow", className="small text-danger fw-semibold me-3"),
                                html.Span("DoD ", className="text-secondary small"),
                                html.Span("11% ↓", id="kpi-op-dod", className="small text-success fw-semibold")
                            ], style={"fontSize": "12px"})
                        ], style=ANT_CSS["card"])
                    ], className="col-lg-3 col-sm-6 mb-3")
                ], className="row g-3 mb-4"),

                # ==============================================================
                # ROW 2: STORE SALES / VISITS TREND & RANKING LIST
                # ==============================================================
                html.Div([
                    html.Div([
                        # Card Header with Tabs & Controls
                        html.Div([
                            # Left Tabs: Sales vs Visits
                            html.Div([
                                html.Button("Sales", id="btn-tab-sales", n_clicks=0, className="btn btn-link text-decoration-none fw-bold px-3 py-2 border-bottom border-primary border-3", style={"color": "#1890ff"}),
                                html.Button("Visits", id="btn-tab-visits", n_clicks=0, className="btn btn-link text-decoration-none text-secondary px-3 py-2 border-0", style={"color": "rgba(0,0,0,0.65)"})
                            ], className="d-flex align-items-center"),

                            # Right Controls: Period Buttons & Date Range Picker
                            html.Div([
                                # Quick Period Buttons
                                html.Div([
                                    html.Button("All day", id="btn-period-day", className="btn btn-sm btn-light border me-1 small", style={"fontSize": "12px"}),
                                    html.Button("All week", id="btn-period-week", className="btn btn-sm btn-light border me-1 small", style={"fontSize": "12px"}),
                                    html.Button("All month", id="btn-period-month", className="btn btn-sm btn-primary border me-1 small fw-bold", style={"fontSize": "12px", "backgroundColor": "#1890ff", "borderColor": "#1890ff"}),
                                    html.Button("All year", id="btn-period-year", className="btn btn-sm btn-light border me-3 small", style={"fontSize": "12px"})
                                ], className="d-none d-md-flex align-items-center"),

                                # Date Range Picker
                                html.Div([
                                    dcc.DatePickerRange(
                                        id="date-range-picker",
                                        start_date=(datetime.date.today() - timedelta(days=180)).strftime("%Y-%m-%d"),
                                        end_date=datetime.date.today().strftime("%Y-%m-%d"),
                                        display_format="YYYY-MM-DD",
                                        className="small"
                                    )
                                ])
                            ], className="d-flex align-items-center")
                        ], className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-2 mb-3"),

                        # Card Body: Left Grouped Bar Chart (8 cols) | Right Ranking List (4 cols)
                        html.Div([
                            # Left: Store Sales Trend (Grouped Bar Chart)
                            html.Div([
                                html.H6("Store Sales Trend", id="trend-chart-title", className="fw-bold text-dark mb-1"),
                                dcc.Graph(id="chart-store-trend", config={"displayModeBar": False}, style={"height": "340px"})
                            ], className="col-lg-8 col-md-7 mb-3"),

                            # Right: Store Ranking List (Top 1-7)
                            html.Div([
                                html.H6("Store Sales Ranking", id="ranking-list-title", className="fw-bold text-dark mb-3"),
                                html.Div(id="ranking-list-container", className="space-y-2")
                            ], className="col-lg-4 col-md-5 mb-3")
                        ], className="row")
                    ], style={**ANT_CSS["card"], "padding": "16px 24px"})
                ], className="mb-4")

            ], className="p-4 flex-grow-1", style={"backgroundColor": "#f0f2f5", "minHeight": "calc(100vh - 64px)"})
        ], className="flex-grow-1 d-flex flex-column")
    ], className="d-flex w-100")
], style={"fontFamily": ANT_CSS["font"], "backgroundColor": "#f0f2f5"})


# ==============================================================================
# INTERACTIVE DASH CALLBACKS (PRODUCTION INTEGRATION)
# ==============================================================================

# Callback 1: Quick period buttons toggle DatePickerRange and active styling
@app.callback(
    [
        Output("date-range-picker", "start_date"),
        Output("date-range-picker", "end_date"),
        Output("store-period-filter", "data"),
        Output("btn-period-day", "className"),
        Output("btn-period-week", "className"),
        Output("btn-period-month", "className"),
        Output("btn-period-year", "className")
    ],
    [
        Input("btn-period-day", "n_clicks"),
        Input("btn-period-week", "n_clicks"),
        Input("btn-period-month", "n_clicks"),
        Input("btn-period-year", "n_clicks")
    ],
    prevent_initial_call=True
)
def handle_quick_period_buttons(n_day, n_week, n_month, n_year):
    ctx = callback_context
    if not ctx.triggered:
        dash.no_update

    button_id = ctx.triggered[0]["prop_id"].split(".")[0]
    today = datetime.date.today()

    btn_inactive = "btn btn-sm btn-light border me-1 small"
    btn_active = "btn btn-sm btn-primary border me-1 small fw-bold"

    if button_id == "btn-period-day":
        start = today.strftime("%Y-%m-%d")
        return start, str(today), "All day", btn_active, btn_inactive, btn_inactive, btn_inactive
    elif button_id == "btn-period-week":
        start = (today - timedelta(days=7)).strftime("%Y-%m-%d")
        return start, str(today), "All week", btn_inactive, btn_active, btn_inactive, btn_inactive
    elif button_id == "btn-period-year":
        start = (today - timedelta(days=365)).strftime("%Y-%m-%d")
        return start, str(today), "All year", btn_inactive, btn_inactive, btn_inactive, btn_active
    else:  # month
        start = (today - timedelta(days=30)).strftime("%Y-%m-%d")
        return start, str(today), "All month", btn_inactive, btn_inactive, btn_active, btn_inactive


# Callback 2: Tab switch styling (Sales vs Visits)
@app.callback(
    [
        Output("btn-tab-sales", "className"),
        Output("btn-tab-sales", "style"),
        Output("btn-tab-visits", "className"),
        Output("btn-tab-visits", "style"),
        Output("trend-chart-title", "children"),
        Output("ranking-list-title", "children")
    ],
    [
        Input("btn-tab-sales", "n_clicks"),
        Input("btn-tab-visits", "n_clicks")
    ]
)
def toggle_sales_visits_tabs(n_sales, n_visits):
    ctx = callback_context
    active_tab = "Sales"
    if ctx.triggered:
        btn_id = ctx.triggered[0]["prop_id"].split(".")[0]
        if btn_id == "btn-tab-visits":
            active_tab = "Visits"

    if active_tab == "Sales":
        return (
            "btn btn-link text-decoration-none fw-bold px-3 py-2 border-bottom border-primary border-3",
            {"color": "#1890ff"},
            "btn btn-link text-decoration-none text-secondary px-3 py-2 border-0",
            {"color": "rgba(0,0,0,0.65)"},
            "Store Sales Trend",
            "Store Sales Ranking"
        )
    else:
        return (
            "btn btn-link text-decoration-none text-secondary px-3 py-2 border-0",
            {"color": "rgba(0,0,0,0.65)"},
            "btn btn-link text-decoration-none fw-bold px-3 py-2 border-bottom border-primary border-3",
            {"color": "#1890ff"},
            "Store Visits Trend",
            "Store Visits Ranking"
        )


# Callback 3: Master Query Callback (Updates KPIs, Sparklines, Grouped Bar Chart, and Ranking List)
@app.callback(
    [
        # KPI 1
        Output("kpi-sales-amount", "children"),
        Output("kpi-sales-wow", "children"),
        Output("kpi-sales-dod", "children"),
        Output("kpi-sales-daily", "children"),
        # KPI 2
        Output("kpi-visits-count", "children"),
        Output("sparkline-visits", "figure"),
        Output("kpi-visits-daily", "children"),
        # KPI 3
        Output("kpi-payments-count", "children"),
        Output("sparkline-payments", "figure"),
        Output("kpi-conversion-rate", "children"),
        # KPI 4
        Output("kpi-op-rate", "children"),
        Output("progress-op-bar", "style"),
        Output("kpi-op-wow", "children"),
        Output("kpi-op-dod", "children"),
        # Charts & Ranking
        Output("chart-store-trend", "figure"),
        Output("ranking-list-container", "children"),
        # Live Pipeline Status
        Output("last-sync-timestamp", "children"),
        Output("status-text", "children"),
        Output("status-text", "style"),
        Output("live-status-pill", "style")
    ],
    [
        Input("date-range-picker", "start_date"),
        Input("date-range-picker", "end_date"),
        Input("store-period-filter", "data"),
        Input("btn-tab-sales", "n_clicks"),
        Input("btn-tab-visits", "n_clicks"),
        Input("interval-heartbeat", "n_intervals")
    ]
)
def update_dashboard_data(start_date, end_date, period_filter, n_sales, n_visits, n_intervals):
    # Determine active tab
    active_tab = "Sales"
    ctx = callback_context
    if ctx.triggered:
        for t in ctx.triggered:
            if "btn-tab-visits" in t["prop_id"]:
                active_tab = "Visits"
                break

    # Fetch fresh real data from database.py
    data = database.fetch_real_data(
        start_date=start_date,
        end_date=end_date,
        period=period_filter,
        metric_tab=active_tab
    )

    kpi = data["kpis"]
    trend_df = data["trend_df"]
    rank_df = data["ranking_df"]
    db_status = data["db_status"]

    # 1. Sparkline for Visits (Smooth Area)
    fig_spark_visits = go.Figure()
    fig_spark_visits.add_trace(go.Scatter(
        y=kpi["visits_sparkline"],
        mode="lines",
        line=dict(color="#975fe4", width=2, shape="spline"),
        fill="tozeroy",
        fillcolor="rgba(151, 95, 228, 0.2)"
    ))
    fig_spark_visits.update_layout(
        margin=dict(l=0, r=0, t=2, b=2),
        xaxis=dict(visible=False),
        yaxis=dict(visible=False),
        paper_bgcolor="transparent",
        plot_bgcolor="transparent"
    )

    # 2. Sparkline for Payments (Mini Bars)
    fig_spark_pay = go.Figure()
    fig_spark_pay.add_trace(go.Bar(
        y=kpi["payments_sparkline"],
        marker_color="#1890ff",
        opacity=0.85
    ))
    fig_spark_pay.update_layout(
        margin=dict(l=0, r=0, t=2, b=2),
        xaxis=dict(visible=False),
        yaxis=dict(visible=False),
        paper_bgcolor="transparent",
        plot_bgcolor="transparent"
    )

    # 3. Main Trend: Grouped Bar Chart by Time and Channel
    fig_trend = go.Figure()
    channels = trend_df["channel"].unique() if "channel" in trend_df.columns else ["Offline Store", "Online Flagship"]
    colors = {"Offline Store": "#1890ff", "Online Flagship": "#2fc25b"}

    for ch in channels:
        sub = trend_df[trend_df["channel"] == ch] if "channel" in trend_df.columns else trend_df
        fig_trend.add_trace(go.Bar(
            x=sub["time_label"] if "time_label" in sub.columns else list(range(len(sub))),
            y=sub["value"] if "value" in sub.columns else sub.iloc[:, 1],
            name=ch,
            marker_color=colors.get(ch, "#1890ff")
        ))

    fig_trend.update_layout(
        barmode="group",
        margin=dict(l=40, r=20, t=10, b=30),
        xaxis=dict(showgrid=False, linecolor="#f0f0f0"),
        yaxis=dict(showgrid=True, gridcolor="#f5f5f5", zeroline=False),
        legend=dict(orientation="h", y=1.1, x=0.7),
        paper_bgcolor="transparent",
        plot_bgcolor="transparent"
    )

    # 4. Sales Ranking List (Top 1-7 with Ant Design circular badges)
    ranking_items = []
    for _, row in rank_df.iterrows():
        rank = row["rank"]
        # Badge color: 1-3 dark, 4-7 light
        badge_style = {
            "width": "20px",
            "height": "20px",
            "borderRadius": "50%",
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "center",
            "fontSize": "11px",
            "fontWeight": "bold",
            "marginRight": "12px",
            "flexShrink": 0,
            "backgroundColor": "#314659" if rank <= 3 else "#f0f2f5",
            "color": "#ffffff" if rank <= 3 else "rgba(0,0,0,0.65)"
        }

        ranking_items.append(
            html.Div([
                html.Div([
                    html.Span(str(rank), style=badge_style),
                    html.Span(row["store_name"], className="small text-truncate", style={"color": "rgba(0,0,0,0.85)", "maxWidth": "180px"})
                ], className="d-flex align-items-center"),
                html.Span(row["formatted_value"], className="small fw-semibold text-secondary")
            ], className="d-flex justify-content-between align-items-center py-2")
        )

    # 5. Live Pipeline Status Engine formatting
    is_connected = db_status.get("status") == "Connected"
    status_text = "LIVE DATA CONNECTED" if is_connected else "DATABASE DISCONNECTED"
    status_color = "#52c41a" if is_connected else "#f5222d"
    pill_bg = "#f6ffed" if is_connected else "#fff1f0"
    pill_border = "#b7eb8f" if is_connected else "#ffa39e"

    sync_display = f"Last synced: {db_status.get('timestamp', '')} ({db_status.get('latency_ms', 0)}ms)"

    op_bar_style = {
        "width": f"{kpi['operation_rate']}%",
        "backgroundColor": "#1890ff",
        "borderRadius": "2px"
    }

    return (
        # KPI 1
        kpi["total_sales_formatted"],
        f"{abs(kpi['wow_sales'])}% {'↑' if kpi['wow_sales'] >= 0 else '↓'}",
        f"{abs(kpi['dod_sales'])}% {'↑' if kpi['dod_sales'] >= 0 else '↓'}",
        kpi["daily_sales"],
        # KPI 2
        kpi["total_visits_formatted"],
        fig_spark_visits,
        kpi["daily_visits"],
        # KPI 3
        kpi["total_payments_formatted"],
        fig_spark_pay,
        kpi["conversion_rate"],
        # KPI 4
        kpi["operation_rate_formatted"],
        op_bar_style,
        f"{kpi['wow_op']}% ↑",
        f"{kpi['dod_op']}% ↓",
        # Charts
        fig_trend,
        ranking_items,
        # Status Engine
        sync_display,
        status_text,
        {"fontSize": "11px", "color": status_color},
        {"backgroundColor": pill_bg, "border": f"1px solid {pill_border}"}
    )


# ==============================================================================
# SERVER ENTRY POINT
# ==============================================================================

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8050))
    print(f"🚀 Ant Design Live Dashboard running on http://127.0.0.1:{port}")
    app.run(debug=True, port=port)
