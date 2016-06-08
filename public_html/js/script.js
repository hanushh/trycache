/* `
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function (window, document, navigator, $, Papa, google) {


    var _this, app = {
        
        /**
         * Declare the element references
         */
        el: {
            submitCsvBtn: $('#submitCsv'),
            csvTA: $('#csvTA'),
            dataTable: $('#dataTable'),
            goBackBtn: $("#goBack"),
            textareaContainer: $("#textareaContainer"),
            dataTableContainer: $("#dataTableContainer")
        },
        
        /** Map Markers **/
        markers: [],
        
        initialize: function () {
            _this = this;
            if (navigator.geolocation)
            {
                navigator.geolocation.getCurrentPosition(_this.initMap);
            } else {
                //this.initMap({coords:""})
            }

            _this.el.submitCsvBtn.click(_this.processCSV);
            _this.el.goBackBtn.click(_this.tableBackBtn);
        },
        initMap: function (position) {
            _this.map = new google.maps.Map(document.getElementById('mapContainer'), {
                center: {lat: position.coords.latitude, lng: position.coords.longitude},
                zoom: 4
            });

        },
        processCSV: function () {
            var data = Papa.parse(_this.el.csvTA.val(), {delimiter: ","});


            _this.el.dataTable
                    .find("thead").html(_this.parseTableHeader(data['data']))
                    .end()
                    .find("tbody").html(_this.parseTableContent(data['data']));

            _this.el.textareaContainer.slideUp(function () {
                _this.el.dataTableContainer.slideDown('fast');
            });


        },
        parseTableHeader: function (data) {
            var tr = $("<tr/>");
            data[0].forEach(function (column) {
                var td = $("<td/>").text(column);
                tr.append(td);
            });
            return tr;

        },
        parseTableContent: function (data) {
            var content = document.createDocumentFragment(),headingArr = data.shift();
            _this.clearMarkers();
            data.forEach(function (row) {
                var tr = $("<tr/>"),
                        marker = _this.addMarker(row),
                        infowindow = new google.maps.InfoWindow({
                            content: _this.generateInfoWindowContentString(row)
                        });

                // Generate <tr/> data
                row.forEach(function (column) {

                    var td = $("<td/>").html(_this.parseColumnContent(column));
                    td.appendTo(tr);
                });
                content.appendChild(tr[0]);

                // Infowindow Event Listener
                marker.addListener('click', function () {
                    infowindow.open(_this.map, marker);
                });

            });
            _this.map.panTo(_this.markers[0].position);
            return content;

        },
        parseColumnContent: function (data) {
            if (data.match(/\.(jpeg|jpg|gif|png)$/) !== null) {

                return $("<img/>").attr("src", data).addClass("img-responsive");
            } else {
                return data;
            }

        },
        generateInfoWindowContentString: function (data) {
            
            if (typeof data !== "object"){
                return "";
            }
            var contentString = '<div id="content">' +
                    '<div id="siteNotice">' +
                    '</div>' +
                    '<h1 id="firstHeading" class="firstHeading">'+data[1]+'</h1>' +
                    '<div id="bodyContent">' +
                    '<p>Founded By: ' +data[2]+
                    '</p>' +
                    '<p>Website: <a href="'+data[8]+'">' +
                    ''+data[8]+'</a> ' +
                                        '</div>' +
                    '</div>';

            return contentString;
        },
        addMarker: function (row) {

            var latLng = new google.maps.LatLng(row[9], row[10]),
                    marker = new google.maps.Marker({
                        position: latLng,
                        map: _this.map,
                        title: row[1]
                    });
            _this.markers.push(marker);
            return marker;
        },
        tableBackBtn: function () {

            _this.el.dataTableContainer.slideUp(function () {
                _this.el.textareaContainer.slideDown('fast');
            });


        },
        clearMarkers: function () {

            while (_this.markers.length) {
                (function () {
                    var marker = _this.markers.pop();
                    marker.setMap(null);
                })();
            }

        }

    };



    $(document).ready(app.initialize.bind(app));


})(window, document, navigator, jQuery, Papa, google);