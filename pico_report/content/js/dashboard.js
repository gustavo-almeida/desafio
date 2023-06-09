/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 82.97890883737145, "KoPercent": 17.02109116262855};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6723853930625763, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6647465037998403, 500, 1500, "reserve"], "isController": false}, {"data": [0.6792542016806723, 500, 1500, "purchase"], "isController": false}, {"data": [0.6816559474167786, 500, 1500, "confirmation"], "isController": false}, {"data": [0.6641837261310855, 500, 1500, "home"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 114740, 19530, 17.02109116262855, 1308.8804427401178, 148, 10622, 421.0, 2025.0, 5324.9000000000015, 10078.990000000002, 268.9077993573774, 1598.4667834403394, 34.05875266807323], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["reserve", 28817, 5035, 17.472325363500712, 1334.0052746642689, 148, 10502, 395.0, 2936.9000000000015, 6909.550000000007, 9527.0, 68.07572736636209, 478.66447356667607, 8.7089065283139], "isController": false}, {"data": ["purchase", 28560, 4705, 16.47408963585434, 1291.3858193277354, 149, 10517, 387.5, 2727.9000000000015, 6738.650000000005, 9397.94000000001, 67.981386049058, 443.37625095955866, 8.763225545386382], "isController": false}, {"data": ["confirmation", 28298, 4533, 16.018799915188353, 1285.7624213725303, 150, 10580, 394.0, 2698.800000000003, 6621.850000000002, 9398.980000000003, 67.95330821524712, 381.42721844660485, 9.025048747337507], "isController": false}, {"data": ["home", 29065, 5257, 18.087046275589195, 1323.6686048512008, 149, 10622, 381.5, 2830.0, 6678.850000000002, 9371.980000000003, 68.11832644298825, 314.7945501859983, 7.982616380037686], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 114740, 19530, "500/Internal Server Error", 725, "The operation lasted too long: It took 2,004 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 14, "The operation lasted too long: It took 2,174 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 14, "The operation lasted too long: It took 2,005 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 14, "The operation lasted too long: It took 2,070 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 13], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["reserve", 28817, 5035, "500/Internal Server Error", 193, "The operation lasted too long: It took 2,004 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 6, "The operation lasted too long: It took 2,174 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 6, "The operation lasted too long: It took 2,019 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 6, "The operation lasted too long: It took 2,010 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 5], "isController": false}, {"data": ["purchase", 28560, 4705, "500/Internal Server Error", 187, "The operation lasted too long: It took 2,059 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 6, "The operation lasted too long: It took 2,023 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 6, "The operation lasted too long: It took 3,335 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 5, "The operation lasted too long: It took 2,078 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 5], "isController": false}, {"data": ["confirmation", 28298, 4533, "500/Internal Server Error", 174, "The operation lasted too long: It took 2,121 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 5, "The operation lasted too long: It took 2,005 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 5, "The operation lasted too long: It took 2,115 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 5, "The operation lasted too long: It took 2,264 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 5], "isController": false}, {"data": ["home", 29065, 5257, "500/Internal Server Error", 171, "The operation lasted too long: It took 2,102 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 7, "The operation lasted too long: It took 2,753 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 6, "The operation lasted too long: It took 2,476 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 6, "The operation lasted too long: It took 3,021 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 6], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});