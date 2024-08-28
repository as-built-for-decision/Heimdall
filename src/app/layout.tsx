import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/libs/potree/potree.css";
import { ScriptLoader } from "@/utils/loaders";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ab4d",
  description: "Visualizador de pointcloud",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ScriptLoader src="./libs/jquery/jquery-3.1.1.min.js">
          <ScriptLoader src="./libs/spectrum/spectrum.js">
            <ScriptLoader src="./libs/jquery-ui/jquery-ui.min.js">
              <ScriptLoader src="./libs/other/BinaryHeap.js">
                <ScriptLoader src="./libs/tween/tween.min.js">
                  <ScriptLoader src="./libs/d3/d3.js">
                    <ScriptLoader src="./libs/proj4/proj4.js">
                      <ScriptLoader src="./libs/openlayers3/ol.js">
                        <ScriptLoader src="./libs/i18next/i18next.js">
                          <ScriptLoader src="./libs/jstree/jstree.js">
                            <ScriptLoader src="./libs/potree/potree.js">
                              <ScriptLoader src="./libs/plasio/js/laslaz.js">
                                <div id="app">{children}</div>
                              </ScriptLoader>
                            </ScriptLoader>
                          </ScriptLoader>
                        </ScriptLoader>
                      </ScriptLoader>
                    </ScriptLoader>
                  </ScriptLoader>
                </ScriptLoader>
              </ScriptLoader>
            </ScriptLoader>
          </ScriptLoader>
        </ScriptLoader>
      </body>
    </html>
  );
}
