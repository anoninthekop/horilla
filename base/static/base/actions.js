var archiveMessages = {
  ar: "هل ترغب حقًا في أرشفة كل الحضور المحدد؟",
  de: "Möchten Sie wirklich alle ausgewählten Anwesenheiten archivieren?",
  es: "Realmente quieres archivar todas las asistencias seleccionadas?",
  en: "Do you really want to archive all the selected allocations?",
  fr: "Voulez-vous vraiment archiver toutes les présences sélectionnées?",
};

var unarchiveMessages = {
  ar: "هل ترغب حقًا في إلغاء أرشفة كل الحضور المحددة؟",
  de: "Möchten Sie wirklich alle ausgewählten archivierten Zuweisungen wiederherstellen?",
  es: "Realmente quieres desarchivar todas las asignaciones seleccionadas?",
  en: "Do you really want to un-archive all the selected allocations?",
  fr: "Voulez-vous vraiment désarchiver toutes les allocations sélectionnées?",
};

var deleterequestMessages = {
  ar: "هل ترغب حقًا في حذف كل الحجوزات المحددة؟",
  de: "Möchten Sie wirklich alle ausgewählten Zuweisungen löschen?",
  es: "Realmente quieres eliminar todas las asignaciones seleccionadas?",
  en: "Do you really want to delete all the selected allocations?",
  fr: "Voulez-vous vraiment supprimer toutes les allocations sélectionnées?",
};

var approveMessages = {
  ar: "هل ترغب حقًا في الموافقة على جميع الطلبات المحددة؟",
  de: "Möchten Sie wirklich alle ausgewählten Anfragen genehmigen?",
  es: "Realmente quieres aprobar todas las solicitudes seleccionadas?",
  en: "Do you really want to approve all the selected requests?",
  fr: "Voulez-vous vraiment approuver toutes les demandes sélectionnées?",
};
var cancelMessages = {
  ar: "هل ترغب حقًا في إلغاء جميع الطلبات المحددة؟",
  de: "Möchten Sie wirklich alle ausgewählten Anfragen stornieren?",
  es: "Realmente quieres cancelar todas las solicitudes seleccionadas?",
  en: "Do you really want to cancel all the selected requests?",
  fr: "Voulez-vous vraiment annuler toutes les demandes sélectionnées?",
};
var requestDeleteMessages = {
  ar: "هل ترغب حقًا في حذف جميع الطلبات المحددة؟",
  de: "Möchten Sie wirklich alle ausgewählten Anfragen löschen?",
  es: "Realmente quieres eliminar todas las solicitudes seleccionadas?",
  en: "Do you really want to delete all the selected requests?",
  fr: "Voulez-vous vraiment supprimer toutes les demandes sélectionnées?",
};
var norowMessages = {
  ar: "لم يتم تحديد أي صفوف.",
  de: "Es wurden keine Zeilen ausgewählt.",
  es: "No se han seleccionado filas.",
  en: "No rows have been selected.",
  fr: "Aucune ligne n'a été sélectionnée.",
};
var rowMessages = {
  ar: " تم الاختيار",
  de: " Ausgewählt",
  es: " Seleccionado",
  en: " Selected",
  fr: " Sélectionné",
};

tickShiftCheckboxes();
function makeShiftListUnique(list) {
  return Array.from(new Set(list));
}

tickWorktypeCheckboxes();
function makeWorktypeListUnique(list) {
  return Array.from(new Set(list));
}

tickRShiftCheckboxes();
function makeRShiftListUnique(list) {
  return Array.from(new Set(list));
}

tickRWorktypeCheckboxes();
function makeRWorktypeListUnique(list) {
  return Array.from(new Set(list));
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function getCurrentLanguageCode(callback) {
  $.ajax({
    type: "GET",
    url: "/employee/get-language-code/",
    success: function (response) {
      var languageCode = response.language_code;
      callback(languageCode); // Pass the language code to the callback
    },
  });
}

$(".all-rshift").change(function (e) {
  var is_checked = $(this).is(":checked");
  if (is_checked) {
    $(".all-rshift-row").prop("checked", true);
  } else {
    $(".all-rshift-row").prop("checked", false);
  }
});

function tickRShiftCheckboxes() {
  var ids = JSON.parse($("#selectedRShifts").attr("data-ids") || "[]");
  uniqueIds = makeRShiftListUnique(ids);
  click = $("#selectedRShifts").attr("data-clicked");
  if (click === "1") {
    $(".all-rshift").prop("checked", true);
  }
  uniqueIds.forEach(function (id) {
    $("#" + id).prop("checked", true);
  });
  var selectedCount = uniqueIds.length;
  getCurrentLanguageCode(function (code) {
    languageCode = code;
    var message = rowMessages[languageCode];
    if (selectedCount > 0) {
      $("#exportRShifts").css("display", "inline-flex");
      $("#selectedShowRShifts").css("display", "inline-flex");
      $("#selectedShowRShifts").text(selectedCount + " -" + message);
    } else {
      $("#selectedShowRShifts").css("display", "none");
      $("#exportRShifts").css("display", "none");
    }
  });
}

$("#archiveRotatingShiftAssign").click(function (e) {
  e.preventDefault();

  var languageCode = null;
  getCurrentLanguageCode(function (code) {
    languageCode = code;
    var confirmMessage = archiveMessages[languageCode];
    var textMessage = norowMessages[languageCode];
    ids = [];
    ids.push($("#selectedRShifts").attr("data-ids"));
    ids = JSON.parse($("#selectedRShifts").attr("data-ids"));
    if (ids.length === 0) {
      Swal.fire({
        text: textMessage,
        icon: "warning",
        confirmButtonText: "Close",
      });
    } else {
      Swal.fire({
        text: confirmMessage,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then(function (result) {
        if (result.isConfirmed) {
          ids = [];
          ids.push($("#selectedRShifts").attr("data-ids"));
          ids = JSON.parse($("#selectedRShifts").attr("data-ids"));
          $.ajax({
            type: "POST",
            url: "/rotating-shift-assign-bulk-archive?is_active=False",
            data: {
              csrfmiddlewaretoken: getCookie("csrftoken"),
              ids: JSON.stringify(ids),
            },
            success: function (response, textStatus, jqXHR) {
              if (jqXHR.status === 200) {
                location.reload(); // Reload the current page
              } else {
                // console.log("Unexpected HTTP status:", jqXHR.status);
              }
            },
          });
        }
      });
    }
  });
});

$("#unArchiveRotatingShiftAssign").click(function (e) {
  e.preventDefault();

  var languageCode = null;
  getCurrentLanguageCode(function (code) {
    languageCode = code;
    var confirmMessage = unarchiveMessages[languageCode];
    var textMessage = norowMessages[languageCode];
    ids = [];
    ids.push($("#selectedRShifts").attr("data-ids"));
    ids = JSON.parse($("#selectedRShifts").attr("data-ids"));
    if (ids.length === 0) {
      Swal.fire({
        text: textMessage,
        icon: "warning",
        confirmButtonText: "Close",
      });
    } else {
      Swal.fire({
        text: confirmMessage,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then(function (result) {
        if (result.isConfirmed) {
          ids = [];
          ids.push($("#selectedRShifts").attr("data-ids"));
          ids = JSON.parse($("#selectedRShifts").attr("data-ids"));
          $.ajax({
            type: "POST",
            url: "/rotating-shift-assign-bulk-archive?is_active=True",
            data: {
              csrfmiddlewaretoken: getCookie("csrftoken"),
              ids: JSON.stringify(ids),
            },
            success: function (response, textStatus, jqXHR) {
              if (jqXHR.status === 200) {
                location.reload(); // Reload the current page
              } else {
                // console.log("Unexpected HTTP status:", jqXHR.status);
              }
            },
          });
        }
      });
    }
  });
});

$("#deleteRotatingShiftAssign").click(function (e) {
  e.preventDefault();

  var languageCode = null;
  getCurrentLanguageCode(function (code) {
    languageCode = code;
    var confirmMessage = deleterequestMessages[languageCode];
    var textMessage = norowMessages[languageCode];
    ids = [];
    ids.push($("#selectedRShifts").attr("data-ids"));
    ids = JSON.parse($("#selectedRShifts").attr("data-ids"));
    if (ids.length === 0) {
      Swal.fire({
        text: textMessage,
        icon: "warning",
        confirmButtonText: "Close",
      });
    } else {
      Swal.fire({
        text: confirmMessage,
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then(function (result) {
        if (result.isConfirmed) {
          ids = [];
          ids.push($("#selectedRShifts").attr("data-ids"));
          ids = JSON.parse($("#selectedRShifts").attr("data-ids"));
          $.ajax({
            type: "POST",
            url: "/rotating-shift-assign-bulk-delete",
            data: {
              csrfmiddlewaretoken: getCookie("csrftoken"),
              ids: JSON.stringify(ids),
            },
            success: function (response, textStatus, jqXHR) {
              if (jqXHR.status === 200) {
                location.reload(); // Reload the current page
              } else {
                // console.log("Unexpected HTTP status:", jqXHR.status);
              }
            },
          });
        }
      });
    }
  });
});

$(".all-rwork-type").change(function (e) {
  var is_checked = $(this).is(":checked");
  if (is_checked) {
    $(".all-rwork-type-row").prop("checked", true);
  } else {
    $(".all-rwork-type-row").prop("checked", false);
  }
});

function tickRWorktypeCheckboxes() {
  var ids = JSON.parse($("#selectedRWorktypes").attr("data-ids") || "[]");
  uniqueIds = makeWorktypeListUnique(ids);
  click = $("#selectedRWorktypes").attr("data-clicked");
  if (click === "1") {
    $(".all-rwork-type").prop("checked", true);
  }
  uniqueIds.forEach(function (id) {
    $("#" + id).prop("checked", true);
  });
  var selectedCount = uniqueIds.length;
  getCurrentLanguageCode(function (code) {
    languageCode = code;
    var message = rowMessages[languageCode];
    if (selectedCount > 0) {
      $("#exportRWorktypes").css("display", "inline-flex");
      $("#selectedShowRWorktypes").css("display", "inline-flex");
      $("#selectedShowRWorktypes").text(selectedCount + " -" + message);
    } else {
      $("#selectedShowRWorktypes").css("display", "none");
      $("#exportRWorktypes").css("display", "none");
    }
  });
}

$("#archiveRotatingWorkTypeAssign").click(function (e) {
  e.preventDefault();

  var languageCode = null;
  getCurrentLanguageCode(function (code) {
    languageCode = code;
    var confirmMessage = archiveMessages[languageCode];
    var textMessage = norowMessages[languageCode];
    ids = [];
    ids.push($("#selectedRWorktypes").attr("data-ids"));
    ids = JSON.parse($("#selectedRWorktypes").attr("data-ids"));
    if (ids.length === 0) {
      Swal.fire({
        text: textMessage,
        icon: "warning",
        confirmButtonText: "Close",
      });
    } else {
      Swal.fire({
        text: confirmMessage,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then(function (result) {
        if (result.isConfirmed) {
          ids = [];
          ids.push($("#selectedRWorktypes").attr("data-ids"));
          ids = JSON.parse($("#selectedRWorktypes").attr("data-ids"));
          $.ajax({
            type: "POST",
            url: "/rotating-work-type-assign-bulk-archive?is_active=False",
            data: {
              csrfmiddlewaretoken: getCookie("csrftoken"),
              ids: JSON.stringify(ids),
            },
            success: function (response, textStatus, jqXHR) {
              if (jqXHR.status === 200) {
                location.reload(); // Reload the current page
              } else {
                // console.log("Unexpected HTTP status:", jqXHR.status);
              }
            },
          });
        }
      });
    }
  });
});

$("#unArchiveRotatingWorkTypeAssign").click(function (e) {
  e.preventDefault();
  getCurrentLanguageCode(function (code) {
    languageCode = code;
    var confirmMessage = unarchiveMessages[languageCode];
    var textMessage = norowMessages[languageCode];
    ids = [];
    ids.push($("#selectedRWorktypes").attr("data-ids"));
    ids = JSON.parse($("#selectedRWorktypes").attr("data-ids"));
    if (ids.length === 0) {
      Swal.fire({
        text: textMessage,
        icon: "warning",
        confirmButtonText: "Close",
      });
    } else {
      Swal.fire({
        text: confirmMessage,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then(function (result) {
        if (result.isConfirmed) {
          ids = [];
          ids.push($("#selectedRWorktypes").attr("data-ids"));
          ids = JSON.parse($("#selectedRWorktypes").attr("data-ids"));
          $.ajax({
            type: "POST",
            url: "/rotating-work-type-assign-bulk-archive?is_active=True",
            data: {
              csrfmiddlewaretoken: getCookie("csrftoken"),
              ids: JSON.stringify(ids),
            },
            success: function (response, textStatus, jqXHR) {
              if (jqXHR.status === 200) {
                location.reload(); // Reload the current page
              } else {
                // console.log("Unexpected HTTP status:", jqXHR.status);
              }
            },
          });
        }
      });
    }
  });
});

$("#deleteRotatingWorkTypeAssign").click(function (e) {
  e.preventDefault();

  var languageCode = null;
  getCurrentLanguageCode(function (code) {
    languageCode = code;
    var confirmMessage = deleterequestMessages[languageCode];
    var textMessage = norowMessages[languageCode];
    ids = [];
    ids.push($("#selectedRWorktypes").attr("data-ids"));
    ids = JSON.parse($("#selectedRWorktypes").attr("data-ids"));
    if (ids.length === 0) {
      Swal.fire({
        text: textMessage,
        icon: "warning",
        confirmButtonText: "Close",
      });
    } else {
      Swal.fire({
        text: confirmMessage,
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then(function (result) {
        if (result.isConfirmed) {
          ids = [];
          ids.push($("#selectedRWorktypes").attr("data-ids"));
          ids = JSON.parse($("#selectedRWorktypes").attr("data-ids"));      
          $.ajax({
            type: "POST",
            url: "/rotating-work-type-assign-bulk-delete",
            data: {
              csrfmiddlewaretoken: getCookie("csrftoken"),
              ids: JSON.stringify(ids),
            },
            success: function (response, textStatus, jqXHR) {
              if (jqXHR.status === 200) {
                location.reload(); // Reload the current page
              } else {
                // console.log("Unexpected HTTP status:", jqXHR.status);
              }
            },
          });
        }
      });
    }
  });
});

$(".all-shift-requests").change(function (e) {
  var is_checked = $(this).is(":checked");
  if (is_checked) {
    $(".all-shift-requests-row").prop("checked", true);
  } else {
    $(".all-shift-requests-row").prop("checked", false);
  }
});

function tickShiftCheckboxes() {
  var ids = JSON.parse($("#selectedShifts").attr("data-ids") || "[]");
  uniqueIds = makeShiftListUnique(ids);
  click = $("#selectedShifts").attr("data-clicked");
  if (click === "1") {
    $(".all-shift-requests").prop("checked", true);
  }
  uniqueIds.forEach(function (id) {
    $("#" + id).prop("checked", true);
  });
  var selectedCount = uniqueIds.length;
  getCurrentLanguageCode(function (code) {
    languageCode = code;
    var message = rowMessages[languageCode];
    if (selectedCount > 0) {
      $("#exportShifts").css("display", "inline-flex");
      $("#selectedShowShifts").css("display", "inline-flex");
      $("#selectedShowShifts").text(selectedCount + " -" + message);
    } else {
      $("#selectedShowShifts").css("display", "none");
      $("#exportShifts").css("display", "none");
    }
  });
}

$("#approveShiftRequest").click(function (e) {
  e.preventDefault();

  var languageCode = null;
  getCurrentLanguageCode(function (code) {
    languageCode = code;
    var confirmMessage = approveMessages[languageCode];
    var textMessage = norowMessages[languageCode];
    ids = [];
    ids.push($("#selectedShifts").attr("data-ids"));
    ids = JSON.parse($("#selectedShifts").attr("data-ids"));
    if (ids.length === 0) {
      Swal.fire({
        text: textMessage,
        icon: "warning",
        confirmButtonText: "Close",
      });
    } else {
      // Use SweetAlert for the confirmation dialog
      Swal.fire({
        text: confirmMessage,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then(function (result) {
        if (result.isConfirmed) {
          ids = [];
          ids.push($("#selectedShifts").attr("data-ids"));
          ids = JSON.parse($("#selectedShifts").attr("data-ids"));
          $.ajax({
            type: "POST",
            url: "/shift-request-bulk-approve",
            data: {
              csrfmiddlewaretoken: getCookie("csrftoken"),
              ids: JSON.stringify(ids),
            },
            success: function (response, textStatus, jqXHR) {
              if (jqXHR.status === 200) {
                location.reload(); // Reload the current page
              } else {
                // console.log("Unexpected HTTP status:", jqXHR.status);
              }
            },
          });
        }
      });
    }
  });
});

$("#cancelShiftRequest").click(function (e) {
  e.preventDefault();

  var languageCode = null;
  getCurrentLanguageCode(function (code) {
    languageCode = code;
    var confirmMessage = cancelMessages[languageCode];
    var textMessage = norowMessages[languageCode];
    ids = [];
    ids.push($("#selectedShifts").attr("data-ids"));
    ids = JSON.parse($("#selectedShifts").attr("data-ids"));
    if (ids.length === 0) {
      Swal.fire({
        text: textMessage,
        icon: "warning",
        confirmButtonText: "Close",
      });
    } else {
      Swal.fire({
        text: confirmMessage,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then(function (result) {
        if (result.isConfirmed) {
          ids = [];
          ids.push($("#selectedShifts").attr("data-ids"));
          ids = JSON.parse($("#selectedShifts").attr("data-ids"));      
          $.ajax({
            type: "POST",
            url: "/shift-request-bulk-cancel",
            data: {
              csrfmiddlewaretoken: getCookie("csrftoken"),
              ids: JSON.stringify(ids),
            },
            success: function (response, textStatus, jqXHR) {
              if (jqXHR.status === 200) {
                location.reload(); // Reload the current page
              } else {
                // console.log("Unexpected HTTP status:", jqXHR.status);
              }
            },
          });
        }
      });
    }
  });
});

$("#deleteShiftRequest").click(function (e) {
  e.preventDefault();

  var languageCode = null;
  getCurrentLanguageCode(function (code) {
    languageCode = code;
    var confirmMessage = requestDeleteMessages[languageCode];
    var textMessage = norowMessages[languageCode];
    ids = [];
    ids.push($("#selectedShifts").attr("data-ids"));
    ids = JSON.parse($("#selectedShifts").attr("data-ids"));
    if (ids.length === 0) {
      Swal.fire({
        text: textMessage,
        icon: "warning",
        confirmButtonText: "Close",
      });
    } else {
      Swal.fire({
        text: confirmMessage,
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then(function (result) {
        if (result.isConfirmed) {
          ids = [];
          ids.push($("#selectedShifts").attr("data-ids"));
          ids = JSON.parse($("#selectedShifts").attr("data-ids"));      
          $.ajax({
            type: "POST",
            url: "/shift-request-bulk-delete",
            data: {
              csrfmiddlewaretoken: getCookie("csrftoken"),
              ids: JSON.stringify(ids),
            },
            success: function (response, textStatus, jqXHR) {
              if (jqXHR.status === 200) {
                location.reload(); // Reload the current page
              } else {
                // console.log("Unexpected HTTP status:", jqXHR.status);
              }
            },
          });
        }
      });
    }
  });
});

$(".all-work-type-requests").change(function (e) {
  var is_checked = $(this).is(":checked");
  if (is_checked) {
    $(".all-work-type-requests-row").prop("checked", true);
  } else {
    $(".all-work-type-requests-row").prop("checked", false);
  }
});

function tickWorktypeCheckboxes() {
  var ids = JSON.parse($("#selectedWorktypes").attr("data-ids") || "[]");
  uniqueIds = makeWorktypeListUnique(ids);
  click = $("#selectedWorktypes").attr("data-clicked");
  if (click === "1") {
    $(".all-work-type-requests").prop("checked", true);
  }
  uniqueIds.forEach(function (id) {
    $("#" + id).prop("checked", true);
  });
  var selectedCount = uniqueIds.length;
  getCurrentLanguageCode(function (code) {
    languageCode = code;
    var message = rowMessages[languageCode];
    if (selectedCount > 0) {
      $("#exportWorktypes").css("display", "inline-flex");
      $("#selectedShowWorktypes").css("display", "inline-flex");
      $("#selectedShowWorktypes").text(selectedCount + " -" + message);
    } else {
      $("#selectedShowWorktypes").css("display", "none");
      $("#exportWorktypes").css("display", "none");
    }
  });
}

$("#approveWorkTypeRequest").click(function (e) {
  e.preventDefault();

  var languageCode = null;
  getCurrentLanguageCode(function (code) {
    languageCode = code;
    var confirmMessage = approveMessages[languageCode];
    var textMessage = norowMessages[languageCode];
    ids = [];
    ids.push($("#selectedWorktypes").attr("data-ids"));
    ids = JSON.parse($("#selectedWorktypes").attr("data-ids"));
    if (ids.length === 0) {
      Swal.fire({
        text: textMessage,
        icon: "warning",
        confirmButtonText: "Close",
      });
    } else {
      Swal.fire({
        text: confirmMessage,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then(function (result) {
        if (result.isConfirmed) {
          e.preventDefault();
          ids = [];
          ids.push($("#selectedWorktypes").attr("data-ids"));
          ids = JSON.parse($("#selectedWorktypes").attr("data-ids"));      
          $.ajax({
            type: "POST",
            url: "/work-type-request-bulk-approve",
            data: {
              csrfmiddlewaretoken: getCookie("csrftoken"),
              ids: JSON.stringify(ids),
            },
            success: function (response, textStatus, jqXHR) {
              if (jqXHR.status === 200) {
                location.reload(); // Reload the current page
              } else {
                // console.log("Unexpected HTTP status:", jqXHR.status);
              }
            },
          });
        }
      });
    }
  });
});

$("#cancelWorkTypeRequest").click(function (e) {
  e.preventDefault();

  var languageCode = null;
  getCurrentLanguageCode(function (code) {
    languageCode = code;
    var confirmMessage = cancelMessages[languageCode];
    var textMessage = norowMessages[languageCode];
    ids = [];
    ids.push($("#selectedWorktypes").attr("data-ids"));
    ids = JSON.parse($("#selectedWorktypes").attr("data-ids"));
    if (ids.length === 0) {
      Swal.fire({
        text: textMessage,
        icon: "warning",
        confirmButtonText: "Close",
      });
    } else {
      Swal.fire({
        text: confirmMessage,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then(function (result) {
        if (result.isConfirmed) {
          ids = [];
          ids.push($("#selectedWorktypes").attr("data-ids"));
          ids = JSON.parse($("#selectedWorktypes").attr("data-ids"));      
          $.ajax({
            type: "POST",
            url: "/work-type-request-bulk-cancel",
            data: {
              csrfmiddlewaretoken: getCookie("csrftoken"),
              ids: JSON.stringify(ids),
            },
            success: function (response, textStatus, jqXHR) {
              if (jqXHR.status === 200) {
                location.reload(); // Reload the current page
              } else {
                // console.log("Unexpected HTTP status:", jqXHR.status);
              }
            },
          });
        }
      });
    }
  });
});

$("#deleteWorkTypeRequest").click(function (e) {
  e.preventDefault();

  var languageCode = null;
  getCurrentLanguageCode(function (code) {
    languageCode = code;
    var confirmMessage = requestDeleteMessages[languageCode];
    var textMessage = norowMessages[languageCode];
    ids = [];
    ids.push($("#selectedWorktypes").attr("data-ids"));
    ids = JSON.parse($("#selectedWorktypes").attr("data-ids"));
    if (ids.length === 0) {
      Swal.fire({
        text: textMessage,
        icon: "warning",
        confirmButtonText: "Close",
      });
    } else {
      Swal.fire({
        text: confirmMessage,
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then(function (result) {
        if (result.isConfirmed) {
          e.preventDefault();
          ids = [];
          ids.push($("#selectedWorktypes").attr("data-ids"));
          ids = JSON.parse($("#selectedWorktypes").attr("data-ids"));
          $.ajax({
            type: "POST",
            url: "/work-type-request-bulk-delete",
            data: {
              csrfmiddlewaretoken: getCookie("csrftoken"),
              ids: JSON.stringify(ids),
            },
            success: function (response, textStatus, jqXHR) {
              if (jqXHR.status === 200) {
                location.reload(); // Reload the current page
              } else {
                // console.log("Unexpected HTTP status:", jqXHR.status);
              }
            },
          });
        }
      });
    }
  });
});
