/* ************************************************************************

   Copyright:
	   2010 Joachim Baran, http://joachim.baran.googlepages.com
		 
   License: GPL, Version 3, http://www.gnu.org/licenses/gpl.html

   Authors:
	   * Joachim Baran

************************************************************************ */

/* ************************************************************************

#asset(gazebo/*)

************************************************************************ */

/**
 * This is the main application class of your custom application "Gazebo"
 */
qx.Class.define("gazebo.Application",
{
  extend : qx.application.Standalone,

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */

      // Create a button
      var button1 = new qx.ui.form.Button("First Button", "gazebo/test.png");
			
      // Document is the application root
      var doc = this.getRoot();
									
			var layout = new qx.ui.layout.VBox();
			layout.setSpacing(4);
			
			var container = new qx.ui.container.Composite(layout);
			
			container.setAlignX("center");
			container.setAlignY("middle");
			
      // Add button to document at fixed coordinates
      container.add(button1);
			container.add(new qx.ui.form.Button("Test", "gazebo/test.png"));
			
			doc.add(container); //, { left: "45%", top: "45%" });
			
			var tableWindow = new qx.ui.window.Window("Table Window");
			var tableModel = new qx.ui.table.model.Simple();
			
			tableWindow.setLayout(new qx.ui.layout.HBox(10));
			tableWindow.setAllowMinimize(false);
			tableWindow.setShowMinimize(false);
			tableWindow.open();
			
			tableModel.setColumns(['a', 'b']);
			tableModel.setData([['abc', 'sdfsd'],['def', 'wefew']]);
			
			var table = new qx.ui.table.Table(tableModel);
			
			table.set({ width: 300, height: 200, decorator: null });
			// doc.add(table, {left: 50, top: 100, right: 500, bottom: 300});
			// tableWindow.add(table);
			tableWindow.add(new gazebo.ui.ConnectionDialog("Hm"));
			tableWindow.setResizable(false, false, false, false);
			tableWindow.setMovable(false);
			tableWindow.setShowClose(true);
			tableWindow.setShowMaximize(false);
			tableWindow.setShowMinimize(false);
			tableWindow.addListener("resize", tableWindow.center, tableWindow);
			
			table.updateContent();

      // Add an event listener
      button1.addListener("execute", function(e) {
        //alert("Sending RPC...");
				
				var rpc = new qx.io.remote.Rpc();
				rpc.setTimeout(1000);
				rpc.setUrl("http://127.0.0.1:8080/gazebo.cgi");
				rpc.setServiceName("gazebo.cgi");
				
				var that = this;
				this.RpcRunning = rpc.callAsync(
					function(result, ex, id)
					{
						that.RpcRunning = null;
						if (ex == null) {
							alert("Async(" + id + ") result: " + result);
						} else {
							alert("Async(" + id + ") exception: " + ex);
						}
					},
					"A Method...");
      });
    }
  }
});
