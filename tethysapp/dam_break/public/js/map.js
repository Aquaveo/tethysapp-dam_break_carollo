/*****************************************************************************
 *                      LIBRARY WRAPPER
 *****************************************************************************/

var MAP_DAM_BREAK = (function() {
    // Wrap the library in a package function
    "use strict"; // And enable strict mode for this library

    /************************************************************************
     *                      MODULE LEVEL / GLOBAL VARIABLES
     *************************************************************************/
    var m_public_interface, m_select_interaction, m_selected_feature, m_overlay,
        m_overlay_content, m_map;

    /************************************************************************
     *                    PRIVATE FUNCTION DECLARATIONS
     *************************************************************************/
    var getModalHTML, getSelectInteraction;


    /************************************************************************
     *                    PRIVATE FUNCTION IMPLEMENTATIONS
     *************************************************************************/
    getModalHTML = function() {
        $.ajax({
            url: 'hydrograph',
            method: 'GET',
            data: {
                'peak_flow': m_selected_feature.get('peak_flow'),
                'time_to_peak': m_selected_feature.get('time_peak'),
                'peak_duration': m_selected_feature.get('peak_duration'),
                'falling_limb_duration': m_selected_feature.get('falling_limb_duration'),
            },
            success: function(data) {
                // add plot data to modal
                $("#plot-pop-up-content").html(data);
                // display modal
                // TODO$('#hydrograph_modal').modal('show');    
                //Initialize Plot
                TETHYS_PLOT_VIEW.initHighChartsPlot($('.highcharts-plot'));
            }
        });
    };

    getSelectInteraction = function() {
        return m_select_interaction;
    };

    m_public_interface = {
        getSelectInteraction: getSelectInteraction,
    };

    /************************************************************************
     *                  INITIALIZATION / CONSTRUCTOR
     *************************************************************************/

    $(function() {
        m_map = TETHYS_MAP_VIEW.getMap();
        m_overlay_content = document.getElementById('plot-pop-up');
        m_select_interaction = TETHYS_MAP_VIEW.getSelectInteraction();

        //when selected, call function to make hydrograph
        m_select_interaction.getFeatures().on('change:length', function(e) {
            if (e.target.getArray().length > 0) {
                // this means there is at least 1 feature selected
                m_selected_feature = e.target.item(0); // 1st feature in Collection
                m_overlay.setPosition(m_selected_feature.getGeometry().getCoordinates());
                getModalHTML();
            } else {
                m_overlay.setPosition(undefined);
            }
        });

        m_overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
          element: m_overlay_content,
          autoPan: true,
          autoPanAnimation: {
            duration: 250
          }
        }));

        m_map.addOverlay(m_overlay);

        //$('#hydrograph_modal').on('hidden.bs.modal', function () {
           // m_select_interaction.getFeatures().clear(); //clear selection on close
        //});
    }); //document read

    return m_public_interface;
}()); // End of package wrapper 
