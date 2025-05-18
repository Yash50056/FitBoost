from flask import Flask, render_template, Response
import cv2
import mediapipe as mp
import numpy as np

app = Flask(__name__)
mp_pose = mp.solutions.pose

cap = cv2.VideoCapture(0)


WAITING_FOR_START = 0
LEFT_ARM_DOWN = 1
RIGHT_ARM_DOWN = 2

@app.route('/')
def index():
    return render_template('index.html')

def is_downward_movement(landmarks):
    left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER].y
    right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER].y
    left_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW].y
    right_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW].y
    left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST].y
    right_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST].y


    return (
        left_shoulder < left_elbow and right_shoulder < right_elbow and
        left_elbow < left_wrist and right_elbow < right_wrist
    )

def generate_frames():
    global cap, mp_pose

    rep_count = 0
    state = WAITING_FOR_START

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while cap.isOpened():
            ret, frame = cap.read()

            if not ret:
                break

            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False

            results = pose.process(image)

            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            try:
                landmarks = results.pose_landmarks.landmark

                downward_movement = is_downward_movement(landmarks)

                if state == WAITING_FOR_START and downward_movement:
                    state = LEFT_ARM_DOWN
                elif state == LEFT_ARM_DOWN and not downward_movement:
                    state = RIGHT_ARM_DOWN
                elif state == RIGHT_ARM_DOWN and not downward_movement:
                    rep_count += 1
                    print(f"Reps Count: {rep_count}")
                    state = WAITING_FOR_START

                cv2.putText(image, f"Reps Count: {rep_count}", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

            except Exception as e:
                print(e)
                pass

            _, buffer = cv2.imencode('.jpg', image)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            
            yield f"data: {rep_count}\n\n"

    cap.release()
    cv2.destroyAllWindows()

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/rep_count')
def rep_count():
    return Response(generate_frames(), mimetype='text/event-stream')

if __name__ == '__main__':
    app.run(debug=True)
