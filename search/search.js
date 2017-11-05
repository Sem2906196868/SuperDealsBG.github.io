$(document).ready(function() {
	$('#superdeals').DataTable( {
		data: dataSet,
		columns: [
		        { title: "Code" },
			{ title: "Product" },
			{ title: "Price" }
		]
	});
});