var inputValue = {
    torso: 0,
    head1: 0,
    head2: 0,
    leftArm: 0,
    rightArm: 0,
    leftLeg: 180,
    rightLeg: 180,
    withShading: 1,
    rotateCamera: 1,
    cameraRadius: 1,
    thetas: 0,
    phi: 0,
    torso2: 0,
    headInsect: 0,
    leftFront: 180,
    rightFront: 180,
    leftBack: 180,
    rightBack: 180,
    tail: 0,
    torso3 : 90,
    globalRotation : -90,
    posx : 400,
    posy : 400,
    headLtoR : 0,
    headUtoD : 0,
    neck : 70,
    frontLfoot : 70,
    frontLleg : 10,
    frontRleg : 80,
    frontRfoot : 10,
    backLleg : 90,
    backLfoot : 40,
    backRleg : 70,
    backRfoot : 30
}

const reset = () => {
    theta[torsoId] = 0;
    theta[head1Id] = 0;
    theta[head2Id] = 0;
    theta[leftUpperArmId] = 0;
    theta[rightUpperArmId] = 0;
    theta[leftUpperLegId] = 180;
    theta[rightUpperLegId] = 180;
    cameraRotation = 1;
    cameraRadius = 1;
    shading = true;
    phi = 0;
    thetas = 0;
}

const input = function () {
    document.getElementById("torso").oninput = function () {
        document.getElementById("torso-value").innerText = this.value;
        theta[torsoId] = this.value;
        inputValue["torso"] = this.value;
        initNodes(torsoId);
    }
    document.getElementById("head1").oninput = function (event) {
        document.getElementById("head1-value").innerText = this.value;
        theta[head1Id] = this.value;
        inputValue["head1"] = this.value;
        initNodes(head1Id);
    };
    document.getElementById("head2").oninput = function (event) {
        document.getElementById("head2-value").innerText = this.value;
        theta[head2Id] = this.value;
        inputValue["head2"] = this.value;
        initNodes(head2Id);
    };
    document.getElementById("leftArm").oninput = function (event) {
        document.getElementById("leftArm-value").innerText = this.value;
        theta[leftUpperArmId] = this.value;
        inputValue["leftArm"] = this.value;
        initNodes(leftUpperArmId);
    };
    document.getElementById("rightArm").oninput = function (event) {
        document.getElementById("rightArm-value").innerText = this.value;
        theta[rightUpperArmId] = this.value;
        inputValue["rightArm"] = this.value;
        initNodes(rightUpperArmId);
    };
    document.getElementById("leftLeg").oninput = function (event) {
        document.getElementById("leftLeg-value").innerText = this.value;
        theta[leftUpperLegId] = this.value;
        inputValue["leftLeg"] = this.value;
        initNodes(leftUpperLegId);
    };
    document.getElementById("rightLeg").onchange = function (event) {
        document.getElementById("rightLeg-value").innerText = this.value;
        theta[rightUpperLegId] = this.value;
        inputValue["rightLeg"] = this.value;
        initNodes(rightUpperLegId);
    };
    document.getElementById("torso2").oninput = function (event) {
        document.getElementById("torso2-value").innerText = this.value;
        theta[torso2Id] = this.value;
        inputValue["torso2"] = this.value;
        initNodes(torso2Id);
    };
    document.getElementById("headInsect").oninput = function (event) {
        document.getElementById("headInsect-value").innerText = this.value;
        theta[headInsectId] = this.value;
        inputValue["headInsect"] = this.value;
        initNodes(headInsectId);
    };
    document.getElementById("leftFront").oninput = function (event) {
        document.getElementById("leftFront-value").innerText = this.value;
        theta[leftFrontId] = this.value;
        inputValue["leftFront"] = this.value;
        initNodes(leftFrontId);
    };
    document.getElementById("rightFront").oninput = function (event) {
        document.getElementById("rightFront-value").innerText = this.value;
        theta[rightFrontId] = this.value;
        inputValue["rightFront"] = this.value;
        initNodes(rightFrontId);
    };
    document.getElementById("leftBack").oninput = function (event) {
        document.getElementById("leftBack-value").innerText = this.value;
        theta[leftBackId] = this.value;
        inputValue["leftBack"] = this.value;
        initNodes(leftBackId);
    };
    document.getElementById("rightBack").oninput = function (event) {
        document.getElementById("rightBack-value").innerText = this.value;
        theta[rightBackId] = this.value;
        inputValue["rightBack"] = this.value;
        initNodes(rightBackId);
    };
    document.getElementById("tail").oninput = function (event) {
        document.getElementById("tail-value").innerText = this.value;
        theta[tailId] = this.value;
        inputValue["tail"] = this.value;
        initNodes(tailId);
    };
    document.getElementById("torso3").oninput = function (event) {
        document.getElementById("torso3-value").innerText = this.value;
        theta[TORSO_ID] = this.value;
        inputValue["torso3"] = this.value;
        initNodes(TORSO_ID);
      };
      document.getElementById("headUtoD").oninput = function (event) {
        document.getElementById("headUtoD-value").innerText = this.value;
        theta[HEAD1_ID] = this.value;
        inputValue["headUtoD"] = this.value;
        initNodes(HEAD1_ID);
      };
      document.getElementById("frontLfoot").oninput = function (event) {
        document.getElementById("frontLfoot-value").innerText = this.value;
        theta[LEFT_FRONT_LEG_ID] = this.value;
        inputValue["frontLfoot"] = this.value;
        initNodes(LEFT_FRONT_LEG_ID);
      };
      document.getElementById("frontLleg").oninput = function (event) {
        document.getElementById("frontLleg-value").innerText = this.value;
        theta[LEFT_FRONT_FOOT_ID] = this.value;
        inputValue["frontLleg"] = this.value;
        initNodes(LEFT_FRONT_FOOT_ID);
      };
      document.getElementById("frontRleg").oninput = function (event) {
        document.getElementById("frontRleg-value").innerText = this.value;
        theta[RIGHT_FRONT_LEG_ID] = this.value;
        inputValue["frontRleg"] = this.value;
        initNodes(RIGHT_FRONT_LEG_ID);
      };
      document.getElementById("frontRfoot").oninput = function (event) {
        document.getElementById("frontRfoot-value").innerText = this.value;
        theta[RIGHT_FRONT_FOOT_ID] = this.value;
        inputValue["frontRfoot"] = this.value;
        initNodes(RIGHT_FRONT_FOOT_ID);
      };
      document.getElementById("backLleg").oninput = function (event) {
        document.getElementById("backLleg-value").innerText = this.value;
        theta[LEFT_BACK_LEG_ID] = this.value;
        inputValue["backLleg"] = this.value;
        initNodes(LEFT_BACK_LEG_ID);
      };
      document.getElementById("backLfoot").oninput = function (event) {
        document.getElementById("backLfoot-value").innerText = this.value;
        theta[LEFT_BACK_FOOT_ID] = this.value;
        inputValue["backLfoot"] = this.value;
        initNodes(LEFT_BACK_FOOT_ID);
      };
      document.getElementById("backRleg").oninput = function (event) {
        document.getElementById("backRleg-value").innerText = this.value;
        theta[RIGHT_BACK_LEG_ID] = this.value;
        inputValue["backRleg"] = this.value;
        initNodes(RIGHT_BACK_LEG_ID);
      };
      document.getElementById("backRfoot").oninput = function (event) {
        document.getElementById("backRfoot-value").innerText = this.value;
        theta[RIGHT_BACK_FOOT_ID] = this.value;
        inputValue["backRfoot"] = this.value;
        initNodes(RIGHT_BACK_FOOT_ID);
      };
      document.getElementById("headLtoR").oninput = function (event) {
        document.getElementById("headLtoR-value").innerText = this.value;
        theta[HEAD2_ID] = this.value;
        inputValue["headLtoR"] = this.value;
        initNodes(NECK_ID);
      };
      document.getElementById("neck").oninput = function (event) {
        document.getElementById("neck-value").innerText = this.value;
        theta[NECK_ID] = this.value;
        inputValue["neck"] = this.value;
        initNodes(NECK_ID);
      };
      document.getElementById("globalRotation").oninput = function (event) {
        document.getElementById("globalRotation-value").innerText = this.value;
        theta[GLOBAL_ANGLE_ID] = this.value;
        inputValue["globalRotation"] = this.value;
        initNodes(TORSO_ID);
      };
      document.getElementById("posx").oninput = function (event) {
        document.getElementById("posx-value").innerText = this.value;
        theta[GLOBAL_X_COORDINATE] = this.value - 400;
        gl.viewport(0 + theta[GLOBAL_X_COORDINATE], 0 + theta[GLOBAL_Y_COORDINATE], canvas.width, canvas.height);
        inputValue["posx"] = this.value;
        initNodes(TORSO_ID);
      };
      document.getElementById("posy").oninput = function (event) {
        document.getElementById("posy-value").innerText = this.value;
        theta[GLOBAL_Y_COORDINATE] = this.value - 400;
        gl.viewport(0 + theta[GLOBAL_X_COORDINATE], 0 + theta[GLOBAL_Y_COORDINATE], canvas.width, canvas.height);
        inputValue["posy"] = this.value;
        initNodes(TORSO_ID);
      };  
    document.getElementById("withShading").onclick = function () {
        shading=this.checked;
        inputValue["withShading"] = this.checked;
        render();
    };
    document.getElementById("moveObject2").onclick = function () {
        document.getElementById("moveObject2").style.display = "none";
        document.getElementById("stopMove2").style.display = "block";
        var slider = [
            document.getElementById("torso2"),
            document.getElementById("headInsect"),
            document.getElementById("leftFront"),
            document.getElementById("rightFront"),
            document.getElementById("leftBack"),
            document.getElementById("rightBack"),
            document.getElementById("tail")
        ];
        var val = [
            document.getElementById("torso2-value"),
            document.getElementById("headInsect-value"),
            document.getElementById("leftFront-value"),
            document.getElementById("rightFront-value"),
            document.getElementById("leftBack-value"),
            document.getElementById("rightBack-value"),
            document.getElementById("tail-value")
        ];
        var inc = [true, true, true, true, true, true, true];
        for (var i = 0; i < 7; i++) {
            slider[i].addEventListener('input', function(e) {
                // val.textContent = slider[i].value;
            });
        }
        interval = setInterval(function() {
            for (var i = 0; i < 7; i++) {
                switch(i) {
                    case 0:
                        (inc[i]) ? slider[i].stepUp() : slider[i].stepDown();
                        if (slider[i].value == 360) inc[i] = false;
                        if (slider[i].value == -360) inc[i] = true;
                        slider[i].dispatchEvent(new Event('input'));
                        break;
                    case 1:
                        (inc[1]) ? slider[i].stepUp() : slider[i].stepDown();
                        if (slider[i].value == 90) inc[i] = false;
                        if (slider[i].value == 0) inc[i] = true;
                        slider[i].dispatchEvent(new Event('input'));
                        break;
                    case 2:
                    case 3:
                        (inc[i]) ? slider[i].stepUp() : slider[i].stepDown();
                        if (slider[i].value == 240) inc[i] = false;
                        if (slider[i].value == 120) inc[i] = true;
                        slider[i].dispatchEvent(new Event('input'));
                        break;
                    case 4:
                    case 5:
                        (inc[i]) ? slider[i].stepDown() : slider[i].stepUp();
                        if (slider[i].value == 240) inc[i] = true;
                        if (slider[i].value == 120) inc[i] = false;
                        slider[i].dispatchEvent(new Event('input'));
                        break;
                    case 6:
                        (inc[i]) ? slider[i].stepUp() : slider[i].stepDown();
                        if (slider[i].value == 40) inc[i] = false;
                        if (slider[i].value == -40) inc[i] = true;
                        slider[i].dispatchEvent(new Event('input'));
                        break;
                }
            }
        }, 10);
    };
    document.getElementById("stopMove2").onclick = function(){
        document.getElementById("moveObject2").style.display = "block";
        document.getElementById("stopMove2").style.display = "none";
        stopInterval(interval)
    };
    document.getElementById("rotateCamera").oninput = function () {
        document.getElementById("rotateCamera-value").innerText = this.value;
        cameraRotation = this.value;
        inputValue["rotateCamera"] = this.value;
        render();
    };
    document.getElementById("cameraRadius").oninput = function () {
        document.getElementById("cameraRadius-value").innerText = this.value;
        cameraRadius = this.value;
        inputValue["cameraRadius"] = this.value;
        render();
    };
    document.getElementById("animation").onclick = function(){
        animation();
    };
    document.getElementById("Button2").onclick = function(){
        thetas += dr;
        inputValue["thetas"] = thetas;
    };
    document.getElementById("Button3").onclick = function(){
        thetas -= dr;
        inputValue["thetas"] = thetas;
    };
    document.getElementById("Button4").onclick = function(){
        phi += dr;
        inputValue["phi"] = phi;
    };
    document.getElementById("Button5").onclick = function(){
        phi -= dr;
        inputValue["phi"] = phi;
    };
    document.getElementById('inputfile').addEventListener('change', function() {
        if (document.getElementById('inputfile').files.length > 0) {
          var reader = new FileReader();
          reader.addEventListener('load', function() {
            var result = JSON.parse(reader.result);
            Object.keys(INPUT_ID).forEach(id => {
              if (INPUT_ID[id]=="withShading"){
                document.getElementById("withShading").checked = result.inputValue[id];
              }
              else{
                document.getElementById(`${INPUT_ID[id]}`).value = parseFloat(result.inputValue[id]);
                document.getElementById(`${INPUT_ID[id]}-value`).innerText = parseFloat(result.inputValue[id]);   
              }
            })
            theta[torsoId] = result.inputValue["torso"];
            theta[head1Id] = result.inputValue["head1"];
            theta[head2Id] = result.inputValue["head2"];
            theta[leftUpperArmId] = result.inputValue["leftArm"];
            theta[rightUpperArmId] = result.inputValue["rightArm"];
            theta[leftUpperLegId] = result.inputValue["leftLeg"];
            theta[rightUpperLegId] = result.inputValue["rightLeg"];
            cameraRotation = result.inputValue["rotateCamera"];
            cameraRadius = result.inputValue["cameraRadius"];
            shading = result.inputValue["withShading"];
            phi = result.inputValue["phi"];
            thetas = result.inputValue["thetas"];
            theta[torso2Id] = result.inputValue["torso2"];
            theta[headInsectId] = result.inputValue["headInsect"];
            theta[leftFrontId] = result.inputValue["leftFront"];
            theta[rightFrontId] = result.inputValue["rightFront"];
            theta[leftBackId] = result.inputValue["leftBack"];
            theta[rightBackId] = result.inputValue["rightBack"];
            theta[tailId] = result.inputValue["tail"];
            theta[TORSO_ID] = result.inputValue["torso3"];
            theta[HEAD1_ID] = result.inputValue["headUtoD"];
            theta[LEFT_FRONT_LEG_ID] = result.inputValue["frontLfoot"];
            theta[LEFT_FRONT_FOOT_ID] = result.inputValue["frontLleg"];
            theta[RIGHT_FRONT_LEG_ID] = result.inputValue["frontRleg"];
            theta[RIGHT_FRONT_FOOT_ID] = result.inputValue["frontRfoot"];
            theta[LEFT_BACK_LEG_ID] = result.inputValue["backLleg"];
            theta[LEFT_BACK_FOOT_ID] = result.inputValue["backLfoot"];
            theta[RIGHT_BACK_LEG_ID] = result.inputValue["backRleg"];
            theta[RIGHT_BACK_FOOT_ID] = result.inputValue["backRfoot"];
            theta[HEAD2_ID] = result.inputValue["headLtoR"];
            theta[NECK_ID] = result.inputValue["neck"];
            theta[GLOBAL_ANGLE_ID] = result.inputValue["globalRotation"];
            theta[GLOBAL_X_COORDINATE] = result.inputValue["posx"];
            theta[GLOBAL_Y_COORDINATE] = result.inputValue["posy"];
            render();
      
            inputValue = {
                torso: 0,
                head1: 0,
                head2: 0,
                leftArm: 0,
                rightArm: 0,
                leftLeg: 180,
                rightLeg: 180,
                withShading: 0,
                rotateCamera: 1,
                cameraRadius: 1,
                thetas: 0,
                phi: 0,
                torso2: 0,
                headInsect: 0,
                leftFront: 180,
                rightFront: 180,
                leftBack: 180,
                rightBack: 180,
                tail: 0,
                torso3 : 90,
                globalRotation : -90,
                posx : 400,
                posy : 400,
                headLtoR : 0,
                headUtoD : 0,
                neck : 70,
                frontLfoot : 70,
                frontLleg : 10,
                frontRleg : 80,
                frontRfoot : 10,
                backLleg : 90,
                backLfoot : 40,
                backRleg : 70,
                backRfoot : 30
            };
          });
      
          reader.readAsText(document.getElementById('inputfile').files[0]);
        }
      });
}