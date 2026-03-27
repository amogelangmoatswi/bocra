-- ============================================
-- BOCRA Seed Data
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Homepage Statistics
INSERT INTO public.site_stats (label, value, icon_name, display_order) VALUES
  ('Active Licences', '3,250+', 'FileText', 1),
  ('.BW Domains', '15,000+', 'Globe', 2),
  ('Consumer Issues Resolved', '98%', 'MessageSquare', 3),
  ('Type Approvals', '1,200+', 'Shield', 4);

-- 2. Licence Types Catalogue
INSERT INTO public.licence_types (title, category, description, examples, icon_name, display_order) VALUES
  ('Network Facilities Provider (NFP)', 'Infrastructure', 'For owning, operating or providing physical infrastructure for communications services.', 'Fibre networks, towers, satellite earth stations', 'Monitor', 1),
  ('Electronic Communications Service (ECS)', 'Services', 'For providing communications services over a network.', 'Mobile operators, ISPs, VoIP providers', 'Smartphone', 2),
  ('Content Service Provider (CSP)', 'Content', 'For providing content (speech, text, data, images, video) over networks.', 'Radio stations, TV broadcasters', 'Radio', 3),
  ('Public Telecommunications Operator (PTO)', 'Services', 'Comprehensive licence for major national operators.', 'BTC, Mascom, Orange', 'Globe', 4),
  ('Designated Postal Operator (DPO)', 'Postal', 'For operators with national universal service obligations.', 'BotswanaPost', 'Mail', 5),
  ('Commercial Postal Operator (CPO)', 'Postal', 'For value-added postal and courier services.', 'DHL, Sprint Couriers', 'Mail', 6),
  ('Value Added Network Service (VANS)', 'Internet', 'For providing specialized data network services.', 'Enterprise broadband, specialized routing', 'Wifi', 7),
  ('Amateur Radio Licence', 'Spectrum', 'For individual hobbyist radio operators.', 'Ham radio operators', 'Radio', 8);

-- 3. Dashboard Datasets
INSERT INTO public.dashboard_datasets (dataset_name, data_json) VALUES
  ('mobile_subscribers', '[
    {"year": "2019", "subscribers": 3.8},
    {"year": "2020", "subscribers": 3.9},
    {"year": "2021", "subscribers": 4.1},
    {"year": "2022", "subscribers": 4.3},
    {"year": "2023", "subscribers": 4.5},
    {"year": "2024", "subscribers": 4.8}
  ]'::jsonb),
  ('market_share', '[
    {"name": "Mascom", "value": 45, "color": "#F59E0B"},
    {"name": "Orange", "value": 35, "color": "#ea580c"},
    {"name": "BTC", "value": 20, "color": "#16a34a"}
  ]'::jsonb),
  ('qos_metrics', '[
    {"month": "Jan", "Call Setup Success": 99.2, "Drop Call Rate": 0.8},
    {"month": "Feb", "Call Setup Success": 98.9, "Drop Call Rate": 0.9},
    {"month": "Mar", "Call Setup Success": 99.5, "Drop Call Rate": 0.5},
    {"month": "Apr", "Call Setup Success": 99.1, "Drop Call Rate": 0.7},
    {"month": "May", "Call Setup Success": 99.4, "Drop Call Rate": 0.6},
    {"month": "Jun", "Call Setup Success": 99.6, "Drop Call Rate": 0.4}
  ]'::jsonb);

-- 4. News Articles
INSERT INTO public.news_articles (title, excerpt, content, status, publish_date) VALUES
  ('BOCRA Announces New Quality of Service Guidelines', 'Updated QoS benchmarks for mobile operators effective Q3 2026, including minimum download speeds and call success rates.', 'The Botswana Communications Regulatory Authority has issued updated Quality of Service (QoS) guidelines that all licensed mobile network operators must comply with by Q3 2026. The new benchmarks include minimum download speeds of 10 Mbps for 4G services, call setup success rates of 99% or higher, and maximum network downtime of 0.1% per quarter.', 'published', '2026-03-20'),
  ('Public Consultation: National Broadband Strategy Update', 'BOCRA invites stakeholders to review and comment on the revised National Broadband Strategy for 2026-2030.', 'BOCRA has opened a public consultation period for the revised National Broadband Strategy covering 2026 to 2030. The strategy outlines plans for nationwide fibre-to-the-home (FTTH) deployment, 5G spectrum allocation, and universal broadband access targets. Stakeholders have until May 2026 to submit written comments.', 'published', '2026-03-15'),
  ('bwCIRT Issues Advisory on Emerging Ransomware Threats', 'The Botswana Computer Incident Response Team warns of increased ransomware activity targeting financial institutions.', 'bwCIRT has issued a critical advisory warning organisations, particularly in the financial sector, about a new wave of ransomware attacks. The advisory recommends immediate patching of known vulnerabilities, implementation of multi-factor authentication, and regular backup verification procedures.', 'published', '2026-03-10'),
  ('Spectrum Auction Results: 5G Bands Awarded', 'Three operators secure 5G spectrum in the 3.5 GHz band following competitive bidding process.', 'Following a transparent auction process, BOCRA has awarded 5G spectrum in the 3.5 GHz band to Mascom, Orange Botswana, and BTC Mobile. The combined auction proceeds of BWP 450 million will be reinvested into the Universal Access and Service Fund to expand connectivity in rural areas.', 'published', '2026-03-05'),
  ('.BW Domain Registration Milestone', 'Botswana''s country-code top-level domain surpasses 15,000 active registrations, reflecting growing digital adoption.', 'The .bw domain registry, managed by BOCRA, has achieved a significant milestone with over 15,000 active domain registrations. This represents a 25% year-on-year increase and signals growing confidence in Botswana''s digital economy. BOCRA continues to promote the .bw namespace as the trusted online identity for Batswana businesses and organisations.', 'published', '2026-02-28');

-- 5. Public Consultations
INSERT INTO public.public_consultations (title, description, status, deadline) VALUES
  ('Draft National Broadband Strategy 2026-2030', 'BOCRA seeks public input on the revised national broadband strategy covering next-generation connectivity, including FTTH expansion, 5G rollout, and universal service obligations for underserved communities.', 'published', '2026-05-01'),
  ('Review of Interconnection Rate Framework', 'Proposed revisions to the cost-based interconnection framework for voice and data services between licensed operators. Comments are invited from all stakeholders.', 'published', '2026-04-15'),
  ('Consumer Protection Regulations Amendment', 'Draft amendments to the Consumer Protection Regulations under the Communications Regulatory Act, addressing billing transparency, service level agreements, and dispute resolution.', 'published', '2026-04-30'),
  ('Mobile Number Portability Implementation Guide', 'Feedback on the proposed implementation timeline and technical specifications for mobile number portability in Botswana.', 'archived', '2025-12-15'),
  ('Review of Wholesale Leased Line Tariffs', 'Assessment of current wholesale pricing for leased line services and proposals for cost-oriented tariff adjustments.', 'archived', '2025-10-30');

-- 6. Cyber Alerts
INSERT INTO public.cyber_alerts (title, description, severity, status, date_issued) VALUES
  ('Critical Vulnerability in Popular Enterprise VPN Appliances', 'A critical remote code execution vulnerability (CVE-2026-1234) has been identified in widely used VPN appliances. Immediate patching is required. All organisations using affected products should update firmware to version 4.2.1 or later.', 'critical', 'published', '2026-03-22'),
  ('Active Phishing Campaign Targeting Banking Customers', 'bwCIRT has identified a sophisticated phishing campaign targeting customers of major Botswana banks. The campaign uses convincing replicas of banking portals distributed via SMS. Do not click links in unsolicited banking messages.', 'high', 'published', '2026-03-18'),
  ('Update Required for Common CMS Frameworks', 'Multiple content management systems including WordPress and Joomla have released patches for moderate-severity SQL injection vulnerabilities. Website administrators should update to the latest versions.', 'medium', 'published', '2026-03-10'),
  ('Best Practices for Secure Remote Work Configurations', 'Advisory on securing remote work environments, including recommendations for VPN usage, endpoint protection, secure Wi-Fi configurations, and multi-factor authentication enforcement.', 'low', 'published', '2026-02-28'),
  ('DNS Poisoning Attempts on .BW Domain Infrastructure', 'bwCIRT detected and mitigated DNS poisoning attempts targeting .bw domain resolution infrastructure. All requests were successfully blocked. Operators should verify their DNS configurations.', 'high', 'published', '2026-02-15');
