precision mediump float;

varying vec3 vPosition;

uniform float uSunAzimuth; // Sun azimuth angle (in degrees)
uniform float uSunElevation; // Sun elevation angle (in degrees)
uniform vec3 uSunColor;
uniform vec3 uSkyColorLow;
uniform vec3 uSkyColorHigh;
uniform float uSunSize;

void main() {
    // Convert angles from degrees to radians
    float azimuth = radians(uSunAzimuth);
    float elevation = radians(uSunElevation);

    // Calculate the sun direction vector based on azimuth and elevation
    vec3 sunDirection = normalize(vec3(
        cos(elevation) * sin(azimuth),
        sin(elevation),
        cos(elevation) * cos(azimuth)
    ));

    // Normalize the fragment position
    vec3 direction = normalize(vPosition);

    // Gradient for the sky (simple blue gradient)
    float t = direction.y * 0.5 + 0.5;
    vec3 skyColor = mix(uSkyColorLow, uSkyColorHigh, t);

    // Compute sun appearance
    float sunIntensity = pow(max(dot(direction, sunDirection), 0.0), 1000.0 / uSunSize);
    vec3 sunColor = uSunColor * sunIntensity;

    // Combine sun and sky color
    vec3 color = skyColor + sunColor;

    gl_FragColor = vec4(color, 1.0);
}